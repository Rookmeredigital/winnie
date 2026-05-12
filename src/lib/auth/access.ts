import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export interface AccessIdentity {
  email: string;
  sub: string;
  name?: string;
  iss: string;
  aud: string | string[];
  raw: JWTPayload;
}

export class AccessVerificationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AccessVerificationError';
  }
}

const JWKS_CACHE = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJwks(teamDomain: string) {
  const cached = JWKS_CACHE.get(teamDomain);
  if (cached) return cached;
  const url = new URL(`https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`);
  const jwks = createRemoteJWKSet(url, {
    cacheMaxAge: 60 * 60 * 1000,
    cooldownDuration: 30_000,
  });
  JWKS_CACHE.set(teamDomain, jwks);
  return jwks;
}

export async function verifyAccessJwt(
  token: string,
  teamDomain: string,
  audience: string,
): Promise<AccessIdentity> {
  if (!token) {
    throw new AccessVerificationError('Missing Access JWT', 'missing_token');
  }
  if (!teamDomain) {
    throw new AccessVerificationError('CF_ACCESS_TEAM_DOMAIN not configured', 'missing_team_domain');
  }
  if (!audience) {
    throw new AccessVerificationError('CF_ACCESS_AUD not configured', 'missing_aud');
  }

  const issuer = `https://${teamDomain}.cloudflareaccess.com`;

  let payload: JWTPayload;
  try {
    const result = await jwtVerify(token, getJwks(teamDomain), {
      issuer,
      audience,
    });
    payload = result.payload;
  } catch (err) {
    throw new AccessVerificationError(
      `Access JWT verification failed: ${(err as Error).message}`,
      'verification_failed',
    );
  }

  const email = typeof payload.email === 'string' ? payload.email : undefined;
  if (!email) {
    throw new AccessVerificationError('Access JWT missing email claim', 'missing_email');
  }
  if (!payload.sub) {
    throw new AccessVerificationError('Access JWT missing sub claim', 'missing_sub');
  }

  return {
    email,
    sub: payload.sub,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    iss: payload.iss as string,
    aud: payload.aud as string | string[],
    raw: payload,
  };
}

export const MOCK_IDENTITY: AccessIdentity = {
  email: 'aaron@rookmeredigital.com',
  sub: 'mock-aaron',
  name: 'Aaron Dolan',
  iss: 'https://rookmere.cloudflareaccess.com',
  aud: 'mock-aud',
  raw: { email: 'aaron@rookmeredigital.com', sub: 'mock-aaron' },
};

export function isDevModeAllowingMock(): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  // Belt-and-braces: the deployed *.pages.dev URL gets gated by
  // Access tonight, but during Step 8 there's a brief window before
  // the Access policy is attached. WINNIE_ALLOW_NO_ACCESS=1 lets
  // the middleware accept the mock identity in that window. MUST be
  // unset (or 0) once Access is in front in production.
  return String(process.env.WINNIE_ALLOW_NO_ACCESS) === '1';
}
