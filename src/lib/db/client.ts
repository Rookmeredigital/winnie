import type { D1Database } from '@cloudflare/workers-types';

let cachedDb: D1Database | null = null;

// Returns the D1 binding from the Cloudflare runtime context, or null
// when running under plain `next dev` (which has no Workers bindings).
// Pages and route handlers that need D1 should branch on null and
// degrade gracefully — they will get a real DB once we run via
// `opennextjs-cloudflare preview` or in deployed production.
export async function getDb(): Promise<D1Database | null> {
  if (cachedDb) return cachedDb;

  try {
    const mod = await import('@opennextjs/cloudflare');
    const ctx = await mod.getCloudflareContext({ async: true });
    const db = (ctx?.env as { DB?: D1Database } | undefined)?.DB;
    if (db) {
      cachedDb = db;
      return db;
    }
  } catch {
    // No Cloudflare context available (plain next dev). Fall through.
  }

  return null;
}

export class NoDbError extends Error {
  constructor(operation: string) {
    super(`D1 binding not available — ${operation} requires Workers runtime (use opennextjs-cloudflare preview or deployed env)`);
    this.name = 'NoDbError';
  }
}
