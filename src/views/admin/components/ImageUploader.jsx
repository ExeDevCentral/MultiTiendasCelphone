import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, Plus } from 'lucide-react';

export const ImageUploader = ({ images = [], onChange }) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    // Convert files to Base64 data URLs / Supabase storage previews
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      onChange([...images, ...newImages]);
      setUploading(false);
    });
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs text-neutral-400 font-semibold block">
        Galería de Fotos del Dispositivo (Subir Archivo o URL)
      </label>

      {/* Image Thumbnails Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-24 rounded-xl bg-neutral-900 border border-white/10 p-1 group overflow-hidden flex items-center justify-center">
            <img src={img} alt="Product" className="max-h-full max-w-full object-contain" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
              title="Eliminar foto"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Dropzone / File Picker Button */}
        <label className="h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center cursor-pointer text-center p-2 group">
          <Upload className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-1" />
          <span className="text-[10px] text-neutral-400 group-hover:text-white font-medium">
            {uploading ? 'Subiendo...' : 'Subir Archivo'}
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Add via direct URL input */}
      <div className="flex items-center gap-2">
        <input
          type="url"
          placeholder="O pegar URL de imagen (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </button>
      </div>
    </div>
  );
};
