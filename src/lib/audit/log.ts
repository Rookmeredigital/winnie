// Append-only audit log writer.
//
// Spec MASTER_SPEC.md §9 + §11.5: this file contains exactly one
// INSERT and zero UPDATE / DELETE statements. The audit log is
// authoritative — anything that mutates a row would compromise it.
// Do not add UPDATE or DELETE here. Ever. Schema changes belong in
// migrations/, not in this code path.

import { getDb } from '@/lib/db/client';

export interface WriteAuditLogInput {
  eventType: string;
  detail: unknown;
  userId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  const db = await getDb();
  if (!db) {
    // Plain next dev or pre-binding deploy preview. Surface that the
    // event would have been audited, but never throw — we don't want
    // audit failures to break user requests.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[audit] ${input.eventType} (no D1 binding — not persisted)`);
    }
    return;
  }

  try {
    await db
      .prepare(
        `INSERT INTO audit_log (id, ts, user_id, event_type, detail, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        new Date().toISOString(),
        input.userId ?? null,
        input.eventType,
        JSON.stringify(input.detail),
        input.ip ?? null,
        input.userAgent ?? null,
      )
      .run();
  } catch (err) {
    // Never let audit failures bubble up — but make them noisy.
    console.error('[audit] write failed', err);
  }
}
