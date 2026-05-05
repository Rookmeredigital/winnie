import { listPendingActions } from '@/lib/db/pending-actions';
import { getCurrentUser } from '@/lib/auth/current-user';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const [user, actions] = await Promise.all([getCurrentUser(), listPendingActions()]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6 md:p-10">
      <header className="flex items-baseline justify-between">
        <h1
          className="text-2xl font-extrabold tracking-tight text-star-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Action queue
        </h1>
        <p
          className="text-[11px] uppercase tracking-[0.3em] text-electric-violet"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {user.email}
        </p>
      </header>

      <section className="glass-panel glass-panel-bright p-6">
        {actions.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-base text-star-white">Quiet skies.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nothing waiting on you. New proposals will appear here for approval.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-electric-violet/10">
            {actions.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-star-white">{a.human_summary}</p>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] text-electric-violet"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {a.connector_id} · {a.action_type}
                  </span>
                </div>
                <p
                  className="text-[11px] text-muted-foreground"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {a.id} · proposed {a.created_at}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
