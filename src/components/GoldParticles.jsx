'use client';

export function GoldParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient radial glow — drifts slowly */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.04] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #c9a227, transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'ambient-drift 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #e4c972, transparent 70%)',
          bottom: '15%',
          right: '10%',
          animation: 'ambient-drift 30s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.025] blur-[80px]"
        style={{
          background: 'radial-gradient(circle, #d4af37, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'ambient-drift 20s ease-in-out infinite',
        }}
      />
    </div>
  );
}
