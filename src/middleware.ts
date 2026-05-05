import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessJwt, isDevModeAllowingMock, AccessVerificationError } from '@/lib/auth/access';

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

  if (isDevModeAllowingMock()) {
    cleanHeaders.set(MOCK_HEADER, '1');
    return NextResponse.next({ request: { headers: cleanHeaders } });
  }

  const token = request.headers.get('cf-access-jwt-assertion') ?? '';
  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN ?? '';
  const audience = process.env.CF_ACCESS_AUD ?? '';

  try {
    const identity = await verifyAccessJwt(token, teamDomain, audience);
    cleanHeaders.set(VERIFIED_EMAIL_HEADER, identity.email);
    cleanHeaders.set(VERIFIED_SUB_HEADER, identity.sub);
    return NextResponse.next({ request: { headers: cleanHeaders } });
  } catch (err) {
    const code = err instanceof AccessVerificationError ? err.code : 'unknown';
    return new NextResponse(`Unauthorised: ${code}`, { status: 401 });
  }
}

export const config = {
  // Run on every request except Next internals, static files, and
  // the favicon. Cloudflare Access also gates everything in front,
  // but this is belt-and-braces.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
