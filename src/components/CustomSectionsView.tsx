import React from 'react';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { CustomSection } from '../types';
import { ShareButton } from './ShareButton';

interface CustomSectionsDirectoryProps {
  sections: CustomSection[];
  onSelectSection: (slug: string) => void;
  onNavigateDonations?: () => void;
  onNavigateContact?: () => void;
}

export const CustomSectionsDirectory: React.FC<CustomSectionsDirectoryProps> = ({
  sections = [],
  onSelectSection,
  onNavigateDonations,
  onNavigateContact,
}) => {
  const publishedSections = (sections || [])
    .filter((s) => s.isPublished)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Dossiers Thématiques & Réalisations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Toutes les Sections & Projets ADMDO
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-base sm:text-lg">
              Explorez chaque initiative en détail. Chaque section possède sa page dédiée et son lien unique prêt à être partagé avec les adhérents et partenaires.
            </p>
          </div>

          <div className="self-start sm:self-center">
            <ShareButton
              pageTitle="Sections & Dossiers Thématiques ADMDO"
              pagePath="sections"
              label="Partager ce répertoire"
              variant="primary"
            />
          </div>
        </div>

        {/* Section Cards List */}
        <div className="space-y-8">
          {publishedSections.map((section, index) => (
            <div
              key={section.id}
              id={`section-item-${section.slug}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col md:flex-row"
            >
              {section.imageUrl && (
                <div className="md:w-2/5 aspect-16/10 md:aspect-auto overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {section.category || 'Projet Communautaire'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Dossier #{index + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-2 hover:text-emerald-700 transition">
                    <button
                      type="button"
                      onClick={() => onSelectSection(section.slug)}
                      className="text-left"
                    >
                      {section.title}
                    </button>
                  </h2>

                  {section.subtitle && (
                    <p className="text-sm font-medium text-emerald-800 mb-3">
                      {section.subtitle}
                    </p>
                  )}

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {section.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectSection(section.slug)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-95"
                    >
                      <span>Lire la page complète</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {section.buttonText && section.buttonUrl && (
                      <a
                        href={section.buttonUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-emerald-700 text-sm font-medium hover:bg-slate-100 rounded-xl transition"
                      >
                        <span>{section.buttonText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <ShareButton
                    pageTitle={section.title}
                    pagePath={`section/${section.slug}`}
                    label="Partager ce projet"
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SingleSectionPageProps {
  section: CustomSection;
  onBack: () => void;
  onNavigateDonations?: () => void;
  onNavigateContact?: () => void;
}

export const SingleSectionPage: React.FC<SingleSectionPageProps> = ({
  section,
  onBack,
  onNavigateDonations,
  onNavigateContact,
}) => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back and Share */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Retour aux sections</span>
          </button>

          <ShareButton
            pageTitle={section.title}
            pagePath={`section/${section.slug}`}
            label="Partager ce dossier"
            variant="primary"
            size="sm"
          />
        </div>

        {/* Section Header */}
        <div className="mb-8">
          {section.category && (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
              {section.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="mt-3 text-lg sm:text-xl text-emerald-800 font-medium">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {section.imageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src={section.imageUrl}
              alt={section.title}
              className="w-full max-h-[460px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-12">
          {section.content}
        </div>

        {/* Action Button & Sharing Footer */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Soutenir cette initiative</h3>
            <p className="text-sm text-slate-600">
              Partagez ce dossier avec vos proches ou effectuez une contribution officielle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {section.buttonText && section.buttonUrl && (
              <a
                href={section.buttonUrl}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition active:scale-95 text-sm"
              >
                {section.buttonText}
              </a>
            )}
            <ShareButton
              pageTitle={section.title}
              pagePath={`section/${section.slug}`}
              label="Partager"
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
