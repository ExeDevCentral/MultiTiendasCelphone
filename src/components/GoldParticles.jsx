'use client';

import React from 'react';

export function GoldParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Subtle Apple-style ambient lighting backdrops */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/5 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
    </div>
  );
}
