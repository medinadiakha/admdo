import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Share2,
  Check,
  Search,
  Filter,
  ShieldCheck,
  Building,
  DollarSign,
  Briefcase,
  Handshake,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { PartnerDocument } from '../types';

interface DocumentsPageProps {
  documents: PartnerDocument[];
  onNavigateToContact: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents = [],
  onNavigateToContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les documents' },
    { id: 'Statuts & Règlements', label: 'Statuts & Règlements' },
    { id: 'Rapports Financiers', label: 'Rapports Financiers' },
    { id: 'Dossiers Projets', label: 'Dossiers Projets' },
    { id: 'Conventions & Partenariats', label: 'Conventions & Mécénat' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareDoc = (docItem: PartnerDocument) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#documents`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `📄 Document officiel ADMDO - ${docItem.title} : ${shareUrl}`
      );
      setCopiedId(docItem.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Statuts & Règlements':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Rapports Financiers':
        return <DollarSign className="w-5 h-5 text-amber-600" />;
      case 'Dossiers Projets':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Conventions & Partenariats':
        return <Handshake className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'XLSX':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <FolderOpen className="w-4 h-4" />
            Espace Partenaires & Documents Officiels
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Rapports, statuts et dossiers de projets de l’ADMDO
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Dans un esprit de totale transparence et de rigueur, l’ADMDO met à
            la disposition de ses partenaires techniques, financiers, ONG et
            ressortissants l’ensemble des pièces juridiques, bilans comptables
            et cahiers des charges.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Proposer un partenariat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#contact"
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              <span>Demander un dossier complet</span>
            </a>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 mb-1">
            Aucun document trouvé
          </h3>
          <p className="text-xs text-slate-500">
            Essayez de modifier vos critères de recherche ou réinitialisez le filtre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((docItem) => (
            <div
              key={docItem.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(docItem.category)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase block">
                        {docItem.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Publié en {docItem.publishedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getFormatBadgeColor(
                        docItem.format
                      )}`}
                    >
                      {docItem.format}
                    </span>
                    {docItem.fileSize && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {docItem.fileSize}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">
                  {docItem.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {docItem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleShareDoc(docItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Partager le document"
                >
                  {copiedId === docItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Partager</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={docItem.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Consulter / Télécharger</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Institutional Callout for Donors & Partners */}
      <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Vous représentez une institution, une ONG ou une fondation ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Notre bureau exécutif est habilité à signer des conventions de
            financement, des accords de partenariat technique et à fournir des
            comptes d’affectation spéciale pour chaque don reçu.
          </p>
        </div>
        <button
          onClick={onNavigateToContact}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          <Building className="w-4 h-4 text-emerald-400" />
          <span>Contacter le bureau des partenariats</span>
        </button>
      </div>
    </div>
  );
};
