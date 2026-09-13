import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Share2,
  Check,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Handshake,
  Download,
} from 'lucide-react';
import { PartnerDocument } from '../types';

interface AdminDocumentsTabProps {
  documents: PartnerDocument[];
  onAddDocument: (docItem: Omit<PartnerDocument, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

export const AdminDocumentsTab: React.FC<AdminDocumentsTabProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PartnerDocument['category']>(
    'Statuts & Règlements'
  );
  const [fileUrl, setFileUrl] = useState('');
  const [format, setFormat] = useState<PartnerDocument['format']>('PDF');
  const [fileSize, setFileSize] = useState('1.5 Mo');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;

    const today = new Date().toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });

    onAddDocument({
      title: title.trim(),
      description: description.trim(),
      category,
      fileUrl: fileUrl.trim(),
      format,
      fileSize: fileSize.trim() || '1.0 Mo',
      publishedAt: today,
    });

    setTitle('');
    setDescription('');
    setFileUrl('');
    setIsAdding(false);
  };

  const copyShareLink = (docId: string, docTitle: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const shareUrl = `${origin}${pathname}#documents`;
    navigator.clipboard.writeText(
      `📄 Document officiel ADMDO - ${docTitle} : ${shareUrl}`
    );
    setCopiedId(docId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            Documents Partenaires & Rapports Officiels
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Partagez les statuts, bilans financiers, conventions et dossiers de
            projets avec les ONG, mécènes et institutions partenaires.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un document</span>
        </button>
      </div>

      {/* Add Document Form Modal / Panel */}
      {isAdding && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-md transition-all">
          <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            Publier un nouveau document officiel
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titre du document *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Statuts certifiés et règlement intérieur 2026"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catégorie du document
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PartnerDocument['category'])
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                >
                  <option value="Statuts & Règlements">
                    Statuts & Règlements
                  </option>
                  <option value="Rapports Financiers">
                    Rapports Financiers
                  </option>
                  <option value="Dossiers Projets">Dossiers Projets</option>
                  <option value="Conventions & Partenariats">
                    Conventions & Partenariats
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lien public vers le fichier (Google Drive, Cloud ou direct) *
                </label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/... ou https://..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) =>
                      setFormat(e.target.value as PartnerDocument['format'])
                    }
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-bold"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="LIEN">LIEN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Taille
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="1.2 Mo"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Portée du document
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez le contenu du document, l'exercice budgétaire concerné ou les partenaires visés..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
              >
                Publier le document sur la plateforme
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((docItem) => (
          <div
            key={docItem.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {docItem.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {docItem.format} • {docItem.fileSize || '1.0 Mo'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-1 leading-snug">
                {docItem.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {docItem.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => copyShareLink(docItem.id, docItem.title)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
                title="Copier le lien partageable"
              >
                {copiedId === docItem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Lien copié !</span>
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Supprimer le document "${docItem.title}" ?`
                      )
                    ) {
                      onDeleteDocument(docItem.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Supprimer ce document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
