
'use client';

export default function EnginePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Engine (legacy HTML)</h1>
      <div className="border rounded-2xl overflow-hidden" style={{height: '75vh'}}>
        <iframe
          title="Ground Zero Engine"
          src="/engine/index.html"
          width="100%"
          height="100%"
          style={{border: '0'}}
        />
      </div>
      <p className="text-sm text-neutral-400">
        This runs the current HTML engine unmodified inside Next.js. Migrate incrementally when ready.
      </p>
    </section>
  );
}
