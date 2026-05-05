import type { D1Database } from '@cloudflare/workers-types';
import { getDb, NoDbError } from '@/lib/db/client';

export type PendingActionStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';

export interface PendingActionRow {
  id: string;
  created_at: string;
  created_by: string;
  connector_id: string;
  action_type: string;
  action_payload: string;
  human_summary: string;
  status: PendingActionStatus;
  approved_by: string | null;
  approved_at: string | null;
  executed_at: string | null;
  execution_result: string | null;
  expires_at: string;
}

export interface CreatePendingActionInput {
  createdBy: string;
  connectorId: string;
  actionType: string;
  payload: unknown;
  summary: string;
  ttlDays?: number;
}

const DEFAULT_TTL_DAYS = 7;

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export async function listPendingActions(opts: {
  status?: PendingActionStatus;
  limit?: number;
} = {}): Promise<PendingActionRow[]> {
  const db = await getDb();
  if (!db) return [];

  const status = opts.status ?? 'pending';
  const limit = opts.limit ?? 100;

  const result = await db
    .prepare(
      `SELECT id, created_at, created_by, connector_id, action_type, action_payload,
              human_summary, status, approved_by, approved_at, executed_at,
              execution_result, expires_at
         FROM pending_actions
        WHERE status = ?
        ORDER BY created_at DESC
        LIMIT ?`,
    )
    .bind(status, limit)
    .all<PendingActionRow>();

  return result.results ?? [];
}

export async function getPendingActionById(id: string): Promise<PendingActionRow | null> {
  const db = await getDb();
  if (!db) return null;

  return db
    .prepare(
      `SELECT id, created_at, created_by, connector_id, action_type, action_payload,
              human_summary, status, approved_by, approved_at, executed_at,
              execution_result, expires_at
         FROM pending_actions
        WHERE id = ?`,
    )
    .bind(id)
    .first<PendingActionRow>();
}

export async function createPendingAction(input: CreatePendingActionInput): Promise<PendingActionRow> {
  const db = await getDb();
  if (!db) throw new NoDbError('createPendingAction');

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const expiresAt = addDays(now, input.ttlDays ?? DEFAULT_TTL_DAYS);

  await db
    .prepare(
      `INSERT INTO pending_actions
        (id, created_at, created_by, connector_id, action_type, action_payload,
         human_summary, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      id,
      now,
      input.createdBy,
      input.connectorId,
      input.actionType,
      JSON.stringify(input.payload),
      input.summary,
      expiresAt,
    )
    .run();

  const row = await getPendingActionById(id);
  if (!row) throw new Error(`createPendingAction: row ${id} not found after insert`);
  return row;
}

// Status transitions are guarded by `WHERE status = 'pending'` (or the
// appropriate predecessor) so a race cannot double-approve or
// double-execute. If 0 rows changed, the caller is told.
async function transitionStatus(
  db: D1Database,
  id: string,
  fromStatus: PendingActionStatus,
  setSql: string,
  binds: unknown[],
): Promise<void> {
  const result = await db
    .prepare(`UPDATE pending_actions SET ${setSql} WHERE id = ? AND status = ?`)
    .bind(...binds, id, fromStatus)
    .run();
  if (result.meta.changes === 0) {
    throw new Error(`Illegal status transition for ${id}: not in '${fromStatus}'`);
  }
}

export async function markApproved(id: string, approvedBy: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new NoDbError('markApproved');
  const now = new Date().toISOString();
  await transitionStatus(db, id, 'pending', `status = 'approved', approved_by = ?, approved_at = ?`, [approvedBy, now]);
}

export async function markRejected(id: string, rejectedBy: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new NoDbError('markRejected');
  const now = new Date().toISOString();
  await transitionStatus(db, id, 'pending', `status = 'rejected', approved_by = ?, approved_at = ?`, [rejectedBy, now]);
}

export async function markExecuted(id: string, executionResult: unknown): Promise<void> {
  const db = await getDb();
  if (!db) throw new NoDbError('markExecuted');
  const now = new Date().toISOString();
  await transitionStatus(db, id, 'approved', `status = 'executed', executed_at = ?, execution_result = ?`, [
    now,
    JSON.stringify(executionResult),
  ]);
}

export async function markFailed(id: string, error: unknown): Promise<void> {
  const db = await getDb();
  if (!db) throw new NoDbError('markFailed');
  const now = new Date().toISOString();
  await transitionStatus(db, id, 'approved', `status = 'failed', executed_at = ?, execution_result = ?`, [
    now,
    JSON.stringify({ error: String(error) }),
  ]);
}

