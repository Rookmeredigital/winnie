import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessJwt, isDevModeAllowingMock, MOCK_IDENTITY, AccessVerificationError } from '@/lib/auth/access';
import { writeAuditLog } from '@/lib/audit/log';

const MOCK_HEADER = 'x-winnie-mock-identity';
const VERIFIED_EMAIL_HEADER = 'x-winnie-verified-email';
const VERIFIED_SUB_HEADER = 'x-winnie-verified-sub';

export async function middleware(request: NextRequest) {
  // Strip any spoofed identity headers from the inbound request before
  // we set our own. Without this, anyone could send these headers and
  // bypass auth.
  const cleanHeaders = new Headers(request.headers);
  cleanHeaders.delete(MOCK_HEADER);
  cleanHeaders.delete(VERIFIED_EMAIL_HEADER);
  cleanHeaders.delete(VERIFIED_SUB_HEADER);

  const url = new URL(request.url);
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? null;
  const userAgent = request.headers.get('user-agent') ?? null;

  let identityEmail: string;
  let identitySub: string;

  if (isDevModeAllowingMock()) {
    cleanHeaders.set(MOCK_HEADER, '1');
    identityEmail = MOCK_IDENTITY.email;
    identitySub = MOCK_IDENTITY.sub;
  } else {
    const token = request.headers.get('cf-access-jwt-assertion') ?? '';
    const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN ?? '';
    const audience = process.env.CF_ACCESS_AUD ?? '';

    try {
      const identity = await verifyAccessJwt(token, teamDomain, audience);
      cleanHeaders.set(VERIFIED_EMAIL_HEADER, identity.email);
      cleanHeaders.set(VERIFIED_SUB_HEADER, identity.sub);
      identityEmail = identity.email;
      identitySub = identity.sub;
    } catch (err) {
      const code = err instanceof AccessVerificationError ? err.code : 'unknown';
      // Audit unauthorised attempts too — they're often the most
      // interesting events in the log.
      await writeAuditLog({
        eventType: 'unauthorised',
        detail: { path: url.pathname, code },
        ip,
        userAgent,
      });
      return new NextResponse(`Unauthorised: ${code}`, { status: 401 });
    }
  }

  await writeAuditLog({
    eventType: 'page_view',
    detail: { path: url.pathname, method: request.method },
    // In the mock window, identitySub is 'mock-aaron' which has no
    // users row — would FK-fail. Real-mode identitySub is the verified
    // JWT sub, populated in users by getCurrentUser() on first page load.
    userId: isDevModeAllowingMock() ? null : identitySub,
    ip,
    userAgent,
  });

  return NextResponse.next({ request: { headers: cleanHeaders } });
}

export const config = {
  // Run on every request except Next internals, static files, and
  // the favicon. Cloudflare Access also gates everything in front,
  // but this is belt-and-braces.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
