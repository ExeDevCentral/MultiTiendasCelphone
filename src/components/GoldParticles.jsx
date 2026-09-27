'use client';

import React from 'react';

export function GoldParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Blueprint Grid Lines & Coordinates */}
      <div className="absolute top-4 left-6 text-[10px] font-mono text-zinc-600 tracking-wider">
        SYS_REF // LAT: -34.6037 // LON: -58.3816 // GRID: TE-01
      </div>
      <div className="absolute top-4 right-6 text-[10px] font-mono text-zinc-600 tracking-wider hidden sm:block">
        HARDWARE TERMINAL // REV 3.8
      </div>

      {/* Subtle Technical Scale Ruler on Right Edge */}
      <div className="hidden lg:flex flex-col justify-between absolute right-2 top-24 bottom-24 w-4 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex items-center gap-1 justify-end">
            <span className="text-[8px] font-mono text-zinc-500">{i * 5}</span>
            <div className={`h-[1px] bg-zinc-400 ${i % 5 === 0 ? 'w-3' : 'w-1.5'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
