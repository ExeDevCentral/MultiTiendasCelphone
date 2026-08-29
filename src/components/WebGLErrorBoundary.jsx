'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, selectedImageIndex: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL/Three.js 2D gallery fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const fallbackImages = this.props.fallbackImages || [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      ];
      const currentImage = fallbackImages[this.state.selectedImageIndex] || fallbackImages[0];

      return (
        <div
          className="relative w-full rounded-3xl overflow-hidden bg-[#0c0c0e] border border-white/[0.06] p-6 flex flex-col items-center justify-between"
          style={{ height: this.props.height || '500px' }}
        >
          {/* Top Notice */}
          <div className="w-full flex items-center justify-between text-xs text-neutral-400 border-b border-white/[0.04] pb-2.5">
            <span className="flex items-center gap-1.5 text-[#c5a880] font-light tracking-widest uppercase text-[10px]">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galería de Alta Definición</span>
            </span>
            <span className="text-neutral-500 font-mono text-[9px]">2D HD ULTRA</span>
          </div>

          {/* High-res Image Stage */}
          <div className="flex-1 w-full flex items-center justify-center p-4">
            <img
              src={currentImage}
              alt="Device Preview"
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {fallbackImages.length > 1 && (
            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
              {fallbackImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => this.setState({ selectedImageIndex: idx })}
                  className={`w-12 h-12 rounded-xl p-1 bg-black border transition-all cursor-pointer ${
                    this.state.selectedImageIndex === idx
                      ? 'border-[#c5a880] scale-105 shadow-md'
                      : 'border-white/[0.08] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
