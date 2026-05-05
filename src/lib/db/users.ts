import { getDb } from '@/lib/db/client';
import type { AccessIdentity } from '@/lib/auth/access';

export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  role: 'owner' | 'admin' | 'viewer';
  created_at: string;
  last_seen_at: string | null;
}

export async function upsertUser(identity: AccessIdentity): Promise<UserRow | null> {
  const db = await getDb();
  if (!db) return null;

  const now = new Date().toISOString();
  const role = identity.email === 'aaron@rookmeredigital.com' ? 'owner' : 'viewer';
  const displayName = identity.name ?? identity.email.split('@')[0];

  await db
    .prepare(
      `INSERT INTO users (id, email, display_name, role, created_at, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         last_seen_at = excluded.last_seen_at,
         display_name = excluded.display_name`,
    )
    .bind(identity.sub, identity.email, displayName, role, now, now)
    .run();

  const row = await db
    .prepare('SELECT id, email, display_name, role, created_at, last_seen_at FROM users WHERE email = ?')
    .bind(identity.email)
    .first<UserRow>();

  return row;
}
