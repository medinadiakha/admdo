import React, { useState } from 'react';
import {
  Image,
  Filter,
  Maximize2,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import { GalleryPhoto } from '../types';
import { ShareButton } from './ShareButton';

interface GalleryPageProps {
  photos: GalleryPhoto[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ photos = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['Tous', 'Village', 'Forage & Eau', 'École', 'Santé', 'Maraîchage', 'Événements'];

  const filteredPhotos =
    selectedCategory === 'Tous'
      ? (photos || [])
      : (photos || []).filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <Image className="w-3.5 h-3.5" />
              <span>Médiathèque du Village</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galerie Photos de Medina Diakha Wouly
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-base sm:text-lg">
              Explorez en images les réalisations, la vie quotidienne, les forages et les événements communautaires soutenus par l’ADMDO.
            </p>
          </div>

          <div className="self-start sm:self-center">
            <ShareButton
              pageTitle="Galerie Photos - ADMDO Medina Diakha Wouly"
              pagePath="galerie"
              label="Partager la galerie"
              variant="primary"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              id={`photo-card-${photo.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              <div
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setPreviewPhoto(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                    <Maximize2 className="w-5 h-5" />
                  </span>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/70 backdrop-blur-sm text-white text-xs font-medium">
                  {photo.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{photo.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewPhoto(photo)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Agrandir la photo
                  </button>
                  <ShareButton
                    pageTitle={photo.title}
                    pagePath={`galerie#photo-card-${photo.id}`}
                    label="Partager"
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucune photo dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 mb-1 inline-block">
                  {previewPhoto.category} • {previewPhoto.date}
                </span>
                <h3 className="text-lg sm:text-xl font-bold">{previewPhoto.title}</h3>
                {previewPhoto.description && (
                  <p className="text-sm text-slate-300 mt-1">{previewPhoto.description}</p>
                )}
              </div>

              <ShareButton
                pageTitle={previewPhoto.title}
                pagePath={`galerie#photo-card-${previewPhoto.id}`}
                label="Partager cette photo"
                variant="primary"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
