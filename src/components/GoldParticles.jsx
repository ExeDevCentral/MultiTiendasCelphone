'use client';

import { useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function GoldParticles() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: 0 },
      fpsLimit: 60,
      particles: {
        number: {
          value: 60,
          density: { enable: true, width: 1920, height: 1080 },
        },
        color: {
          value: ['#c9a227', '#e4c972', '#d4af37'],
        },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.15, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.6,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1.5, max: 4 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 1,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 0.8 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: {
          enable: true,
          distance: 200,
          color: '#c9a227',
          opacity: 0.12,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 0.3,
              color: '#e4c972',
            },
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles
        id="celstore-gold-particles"
        options={options}
        className="w-full h-full"
      />
    </div>
  );
}
