'use client';

import { motion } from 'framer-motion';

export function OptionCard({ 
  axis, 
  title, 
  hint, 
  selected, 
  onClick 
}: {
  axis: 'C' | 'O' | 'F' | 'O1' | 'O2' | 'F1' | 'F2';
  title: string;
  hint?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  const axisConfig = {
    C: { label: 'Commit', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    O: { label: 'Explore', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    O1: { label: 'Explore', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    O2: { label: 'Delay', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    F: { label: 'Break', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    F1: { label: 'Spike', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    F2: { label: 'Freeze', color: 'bg-red-500/20 text-red-300 border-red-500/30' }
  };

  const config = axisConfig[axis];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={[
        "group w-full text-left rounded-2xl p-5 md:p-6",
        "bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.09]",
        "border border-white/10 hover:border-white/20",
        "shadow-[inset_0_1px_0_#ffffff14] transition-all duration-200",
        "min-h-[88px] focus:outline-none focus:ring-2 focus:ring-white/40",
        selected ? "ring-2 ring-white/60 bg-white/[0.08]" : ""
      ].join(" ")}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-center gap-3">
        <span className={[
          "text-[11px] px-2 py-1 rounded-full border font-medium",
          config.color
        ].join(" ")}>
          {config.label}
        </span>
        <span className="font-medium text-white/90">{title}</span>
      </div>
      {hint && (
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          {hint}
        </p>
      )}
    </motion.button>
  );
}