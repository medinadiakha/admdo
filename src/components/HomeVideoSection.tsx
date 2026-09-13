import React from 'react';
import { Play, Video, Calendar, Sparkles, ExternalLink } from 'lucide-react';
import { HomeVideo } from '../types';
import { getEmbedUrl } from '../lib/videoUtils';
import { ShareButton } from './ShareButton';

interface HomeVideoSectionProps {
  videos: HomeVideo[];
}

export const HomeVideoSection: React.FC<HomeVideoSectionProps> = ({ videos = [] }) => {
  const activeVideos = (videos || []).filter((v) => v.isActive);

  if (activeVideos.length === 0) return null;

  return (
    <section id="home-videos" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Video className="w-3.5 h-3.5" />
              <span>Vidéos Officielles du Village & de l’ADMDO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Vidéos & Réalisations sur le Terrain
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Regardez les vidéos publiées par l’administration pour suivre l’évolution des forages, de l’école et des projets communautaires à Medina Diakha Wouly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ShareButton
              pageTitle="Vidéos Officielles ADMDO Medina Diakha Wouly"
              pagePath="accueil#home-videos"
              label="Partager les vidéos"
              variant="secondary"
              size="sm"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className={`grid gap-8 ${activeVideos.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {activeVideos.map((video) => {
            const embedInfo = getEmbedUrl(video.videoUrl);

            return (
              <div
                key={video.id}
                id={`video-card-${video.id}`}
                className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col transition-all hover:border-emerald-500/50"
              >
                {/* Video Player Box */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {embedInfo.embedUrl ? (
                    embedInfo.type === 'direct' ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster="https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80"
                      >
                        <source src={embedInfo.embedUrl} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                    ) : (
                      <iframe
                        src={embedInfo.embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )
                  ) : (
                    <div className="p-6 text-center">
                      <Play className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-75" />
                      <p className="text-sm text-slate-300 font-medium mb-3">Lien vidéo direct</p>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir la vidéo dans un nouvel onglet
                      </a>
                    </div>
                  )}
                </div>

                {/* Video Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {video.publishedAt}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/20">
                        Officiel ADMDO
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Diffusion publique</span>
                    <ShareButton
                      pageTitle={video.title}
                      pagePath={`accueil#video-card-${video.id}`}
                      label="Partager cette vidéo"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
