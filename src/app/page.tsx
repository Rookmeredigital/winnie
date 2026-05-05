export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="glass-panel glass-panel-bright w-full max-w-xl p-10 text-center">
        <p
          className="mb-4 text-[11px] uppercase tracking-[0.4em] text-electric-violet"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Winnie · v0.1
        </p>
        <h1
          className="mb-3 text-4xl font-extrabold tracking-tight text-star-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome, Aaron
        </h1>
        <p className="text-base text-muted-foreground">
          Quiet skies. Nothing waiting on you.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-electric-violet/30 bg-electric-violet/10 px-4 py-1.5 text-xs text-electric-violet">
          <span className="size-1.5 rounded-full bg-electric-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          All systems online
        </div>
      </section>
    </main>
  );
}
