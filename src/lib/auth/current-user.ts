import { headers } from 'next/headers';
import { MOCK_IDENTITY, type AccessIdentity } from '@/lib/auth/access';

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

// Returns the active user. Upserts into D1 (and updates last_seen_at)
// once Step 6's D1 client lands. For tonight, this is identity-only —
// the row insertion is wired in Step 6 when the typed CRUD layer exists.
export async function getCurrentUser(): Promise<CurrentUser> {
  const identity = await getCurrentIdentity();
  return {
    id: identity.sub,
    email: identity.email,
    displayName: identity.name ?? identity.email.split('@')[0],
    role: identity.email === 'aaron@rookmeredigital.com' ? 'owner' : 'viewer',
  };
}
