import React, { useState, useEffect, useCallback } from 'react';
import {
  HardDrive,
  RefreshCw,
  Search,
  ExternalLink,
  Eye,
  Trash2,
  FileText,
  AlertCircle,
  Folder,
  Download,
  Calendar,
  X,
} from 'lucide-react';
import { AuthState, DriveFileItem } from '../types';
import {
  listDriveMessages,
  readDriveFileContent,
  deleteDriveFile,
} from '../lib/driveService';
import { ConfirmationModal } from './ConfirmationModal';

interface DriveInboxProps {
  auth: AuthState;
  onLoginRequired: () => Promise<string | null>;
}

export const DriveInbox: React.FC<DriveInboxProps> = ({ auth, onLoginRequired }) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [folderLink, setFolderLink] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Preview modal state
  const [previewFile, setPreviewFile] = useState<DriveFileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Deletion confirmation modal state (Required for destructive actions)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = useCallback(async () => {
    let token = auth.token;
    if (!token) {
      token = await onLoginRequired();
      if (!token) return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listDriveMessages(token);
      setFiles(data.files);
      setFolderLink(data.folderViewLink);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Impossible de récupérer les fichiers.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [auth.token, onLoginRequired]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.token) {
      fetchFiles();
    }
  }, [auth.isAuthenticated, auth.token, fetchFiles]);

  const handlePreview = async (file: DriveFileItem) => {
    if (!auth.token) return;
    setPreviewFile(file);
    setIsPreviewLoading(true);
    setPreviewContent('');

    try {
      const content = await readDriveFileContent(auth.token, file.id);
      setPreviewContent(content);
    } catch (err: unknown) {
      setPreviewContent("Impossible de charger le contenu de ce fichier (peut-être un format binaire ou non textuel). Utilisez le lien Google Drive pour l'ouvrir.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !auth.token) return;
    setIsDeleting(true);

    try {
      await deleteDriveFile(auth.token, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Boîte de réception Google Drive
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dossier : <span className="font-semibold text-slate-700">Formulaire de Contact - Messages</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {folderLink && (
            <a
              id="open-drive-folder-link"
              href={folderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
            >
              <Folder className="w-4 h-4 text-amber-600" />
              <span>Ouvrir le dossier Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            id="refresh-drive-files-button"
            type="button"
            onClick={fetchFiles}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Erreur Google Drive</p>
            <p className="text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-messages-input"
            type="text"
            placeholder="Rechercher par nom ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 w-full sm:w-auto text-right font-medium">
          {filteredFiles.length} fichier{filteredFiles.length > 1 ? 's' : ''} trouvé{filteredFiles.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading && files.length === 0 ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Chargement des fichiers Google Drive...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">Aucun message pour l'instant</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery
                ? 'Aucun résultat ne correspond à votre recherche.'
                : 'Les messages envoyés via le formulaire apparaîtront ici et seront automatiquement stockés dans votre Google Drive.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFiles.map((file) => {
              const isAttachment = file.name.startsWith('PJ_');
              const dateStr = file.createdTime
                ? new Date(file.createdTime).toLocaleString('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Date inconnue';

              return (
                <div
                  key={file.id}
                  id={`drive-file-${file.id}`}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isAttachment
                          ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm truncate">
                          {file.name}
                        </span>
                        {isAttachment && (
                          <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                            Pièce jointe
                          </span>
                        )}
                      </div>

                      {file.description && (
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                          {file.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                        {file.size && (
                          <span>• {(parseInt(file.size, 10) / 1024).toFixed(1)} Ko</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      id={`preview-file-${file.id}`}
                      type="button"
                      onClick={() => handlePreview(file)}
                      title="Prévisualiser le message"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lire</span>
                    </button>

                    {file.webViewLink && (
                      <a
                        id={`open-link-${file.id}`}
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ouvrir dans Google Drive"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Drive</span>
                      </a>
                    )}

                    <button
                      id={`delete-file-${file.id}`}
                      type="button"
                      onClick={() => setFileToDelete(file)}
                      title="Supprimer ce fichier (Confirmation requise)"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Text Preview Modal */}
      {previewFile && (
        <div
          id="preview-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-base font-semibold text-slate-800 truncate">
                  {previewFile.name}
                </h3>
              </div>
              <button
                id="close-preview-button"
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-50/50 whitespace-pre-wrap leading-relaxed">
              {isPreviewLoading ? (
                <div className="py-12 text-center font-sans text-slate-500">
                  <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-2" />
                  Récupération du contenu depuis Google Drive...
                </div>
              ) : (
                previewContent || 'Contenu vide ou inaccessible.'
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Fichier ID: {previewFile.id}
              </div>
              {previewFile.webViewLink && (
                <a
                  href={previewFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir sur Google Drive</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive Operation */}
      <ConfirmationModal
        isOpen={!!fileToDelete}
        title="Supprimer le fichier de Google Drive ?"
        message={`Êtes-vous certain de vouloir supprimer définitivement le fichier "${fileToDelete?.name}" de votre Google Drive ? Cette action est irréversible.`}
        confirmLabel="Oui, supprimer ce fichier"
        cancelLabel="Annuler"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setFileToDelete(null)}
      />
    </div>
  );
};
