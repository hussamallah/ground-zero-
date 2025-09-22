
'use client';

export default function EnginePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Engine (Legacy HTML - Not Used)</h1>
      <div className="border rounded-2xl overflow-hidden bg-gray-100 p-8" style={{height: '75vh'}}>
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-4">Legacy HTML Engine Moved</h2>
          <p className="mb-4">
            The legacy HTML engine has been moved to <code className="bg-gray-200 px-2 py-1 rounded">/not-used/engine/</code> 
            and is no longer actively used.
          </p>
          <p className="text-sm">
            The React version at <code className="bg-gray-200 px-2 py-1 rounded">/quiz</code> now contains all the functionality.
          </p>
        </div>
      </div>
      <p className="text-sm text-neutral-400">
        Legacy HTML engine moved to not-used folder. React version is now the primary implementation.
      </p>
    </section>
  );
}
