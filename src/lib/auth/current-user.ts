import { headers } from 'next/headers';
import { MOCK_IDENTITY, type AccessIdentity } from '@/lib/auth/access';
import { upsertUser } from '@/lib/db/users';

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'viewer';
}

export async function getCurrentIdentity(): Promise<AccessIdentity> {
  const h = await headers();

  if (h.get('x-winnie-mock-identity') === '1') {
    return MOCK_IDENTITY;
  }

  const email = h.get('x-winnie-verified-email');
  const sub = h.get('x-winnie-verified-sub');
  if (!email || !sub) {
    throw new Error('No verified Access identity on request — middleware misconfigured?');
  }

  return {
    email,
    sub,
    iss: '',
    aud: '',
    raw: { email, sub },
  };
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const identity = await getCurrentIdentity();
  const row = await upsertUser(identity);

  // Fall back to identity-only projection when D1 isn't reachable
  // (plain next dev). The pages still need a CurrentUser to render.
  if (!row) {
    return {
      id: identity.sub,
      email: identity.email,
      displayName: identity.name ?? identity.email.split('@')[0],
      role: identity.email === 'aaron@rookmeredigital.com' ? 'owner' : 'viewer',
    };
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
  };
}
