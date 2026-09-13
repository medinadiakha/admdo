import React, { useState } from 'react';
import { Newspaper, Pin, Calendar, User, ChevronRight, X, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  newsList: NewsArticle[];
  onOpenAdmin: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsList = [], onOpenAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = ['Tous', 'Eau & Forage', 'Éducation', 'Santé', 'Vie Associative', 'Diaspora'];

  const filteredNews =
    selectedCategory === 'Tous'
      ? (newsList || [])
      : (newsList || []).filter((n) => n.category === selectedCategory);

  return (
    <section id="actualites" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Newspaper className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dernières Nouvelles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Actualités de Medina Diakha Wouly
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Suivez l'avancement des chantiers, les réalisations et la vie associative du village.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-xs font-bold px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <span>+ Publier une nouvelle</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {article.category}
                  </span>

                  {article.isPinned && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-700" />
                      <span>À la une</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-800 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-400 font-medium">
                  <span>{article.publishedAt}</span>
                  <span className="mx-1.5">•</span>
                  <span className="text-slate-600">{article.authorRole}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                >
                  <span>Lire la suite</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Full Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[88vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedArticle.category}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-3">
                {selectedArticle.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <span>Publié le {selectedArticle.publishedAt}</span>
                <span>•</span>
                <span>Par {selectedArticle.authorName} ({selectedArticle.authorRole})</span>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                {selectedArticle.content}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
