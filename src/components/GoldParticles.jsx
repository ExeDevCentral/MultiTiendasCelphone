'use client';

import { useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

let loaded = false;

export function GoldParticles() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: 0 },
      fpsLimit: 60,
      particles: {
        number: {
          value: 40,
          density: { enable: true, width: 1920, height: 1080 },
        },
        color: {
          value: ['#c9a227', '#e4c972', '#d4af37'],
        },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.03, max: 0.12 },
          animation: {
            enable: true,
            speed: 0.4,
            minimumValue: 0.02,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1.5,
            minimumValue: 0.5,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.15, max: 0.4 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: {
          enable: true,
          distance: 180,
          color: '#c9a227',
          opacity: 0.04,
          width: 0.8,
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
            distance: 160,
            links: {
              opacity: 0.15,
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
        loaded={() => { loaded = true; }}
      />
    </div>
  );
}
