
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Ground Zero</h1>
      <p className="text-neutral-300">Monorepo scaffold is ready. App Router, server components by default.</p>
      <div className="space-x-3">
        <Link className="underline" href="/quiz">Try demo quiz</Link>
        <Link className="underline" href="/api/health">Health API</Link>
        <Link className="underline" href="/engine">Run legacy engine</Link>
      </div>
    </section>
  );
}
