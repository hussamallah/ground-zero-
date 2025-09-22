
'use client';
import * as React from 'react';

type Item = { id: string; label: string; onSelect: () => void };

export function FocusGrid({ items }: { items: Item[] }) {
  const refs = React.useRef<(HTMLButtonElement|null)[]>([]);
  React.useEffect(() => { refs.current[0]?.focus(); }, []);
  function onKey(e: React.KeyboardEvent, idx: number) {
    const cols = 2;
    const max = items.length - 1;
    let next = idx;
    switch (e.key) {
      case 'ArrowRight': next = Math.min(max, idx + 1); break;
      case 'ArrowLeft': next = Math.max(0, idx - 1); break;
      case 'ArrowDown': next = Math.min(max, idx + cols); break;
      case 'ArrowUp': next = Math.max(0, idx - cols); break;
      default: return;
    }
    e.preventDefault();
    refs.current[next]?.focus();
  }
  return (
    <div role="list" aria-label="choices" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((it, i) => (
        <button
          key={it.id}
          ref={el => (refs.current[i] = el)}
          className="rounded-2xl border p-4 text-left focus:outline-none focus:ring-2"
          onClick={it.onSelect}
          onKeyDown={e => onKey(e, i)}
          role="listitem"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
