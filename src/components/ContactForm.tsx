import React, { useState, useRef } from 'react';
import {
  Send,
  Upload,
  CheckCircle2,
  ExternalLink,
  Paperclip,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  FolderCheck,
} from 'lucide-react';
import { ContactFormData, AuthState, StoredMessageRecord } from '../types';
import { saveContactMessageToDrive } from '../lib/driveService';

interface ContactFormProps {
  auth: AuthState;
  onLoginRequired: () => Promise<string | null>;
  onMessageSaved?: (record: StoredMessageRecord) => void;
  initialCategory?: string;
  initialSubject?: string;
}

const CATEGORIES = [
  'Demande générale',
  'Projet Médina Diakha Ouly',
  'Partenariat & Mécénat',
  'Adhésion & Bénévolat',
  'Don ou Soutien financier',
  'Événements & Sensibilisation',
  'Autre demande',
];

const PRIORITIES: Array<{ label: ContactFormData['priority']; color: string; desc: string }> = [
  { label: 'Basse', color: 'border-slate-300 text-slate-700 hover:bg-slate-50', desc: 'Délai usuel' },
  { label: 'Normale', color: 'border-emerald-300 text-emerald-800 hover:bg-emerald-50', desc: 'Recommandé' },
  { label: 'Haute', color: 'border-amber-300 text-amber-800 hover:bg-amber-50', desc: 'Important' },
  { label: 'Urgente', color: 'border-rose-300 text-rose-800 hover:bg-rose-50', desc: 'Priorité maximale' },
];

export const ContactForm: React.FC<ContactFormProps> = ({
  auth,
  onLoginRequired,
  onMessageSaved,
  initialCategory,
  initialSubject,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: auth.user?.displayName || '',
    email: auth.user?.email || '',
    phone: '',
    subject: initialSubject || '',
    category: initialCategory || CATEGORIES[0],
    priority: 'Normale',
    message: '',
    consent: true,
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');
  const [submittedRecord, setSubmittedRecord] = useState<StoredMessageRecord | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial category or subject when changed
  React.useEffect(() => {
    if (initialCategory || initialSubject) {
      setFormData((prev) => ({
        ...prev,
        category: initialCategory || prev.category,
        subject: initialSubject || prev.subject,
      }));
    }
  }, [initialCategory, initialSubject]);

  // Synchronize Google user info if not edited yet
  React.useEffect(() => {
    if (auth.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || auth.user?.displayName || '',
        email: prev.email || auth.user?.email || '',
      }));
    }
  }, [auth.user]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Veuillez saisir votre nom et prénom.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Veuillez saisir votre adresse email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Veuillez saisir une adresse email valide.';
    }

    if (!formData.subject.trim()) {
      errs.subject = "Veuillez renseigner l'objet de votre demande.";
    }

    if (!formData.message.trim()) {
      errs.message = 'Veuillez rédiger votre message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Le message doit comporter au moins 10 caractères.';
    }

    if (!formData.consent) {
      errs.consent = "L'acceptation des conditions d'enregistrement est obligatoire.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          attachment: 'La taille du fichier ne doit pas dépasser 15 Mo.',
        }));
        return;
      }
      setAttachment(file);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.attachment;
        return copy;
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          attachment: 'La taille du fichier ne doit pas dépasser 15 Mo.',
        }));
        return;
      }
      setAttachment(file);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.attachment;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check/Obtain Google Auth token
      let token = auth.token;
      if (!token) {
        setSubmitStep('Connexion à votre compte Google Drive...');
        token = await onLoginRequired();
        if (!token) {
          throw new Error('La connexion Google Drive est nécessaire pour enregistrer le message.');
        }
      }

      // 2. Saving to Drive
      setSubmitStep('Création & synchronisation dans Google Drive...');
      const result = await saveContactMessageToDrive(token, formData, attachment);

      setSubmitStep('Message enregistré avec succès !');
      setSubmittedRecord(result.record);
      if (onMessageSaved) {
        onMessageSaved(result.record);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur s'est produite lors de l'envoi.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
      setSubmitStep('');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: auth.user?.displayName || '',
      email: auth.user?.email || '',
      phone: '',
      subject: '',
      category: CATEGORIES[0],
      priority: 'Normale',
      message: '',
      consent: true,
    });
    setAttachment(null);
    setErrors({});
    setSubmittedRecord(null);
    setServerError(null);
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedRecord) {
    return (
      <div
        id="contact-form-success-card"
        className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Message transmis et sauvegardé !
            </h2>
            <p className="text-sm text-slate-600">
              Votre message a été archivé en toute sécurité dans votre Google Drive.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-8 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Référence du message
            </span>
            <span className="font-mono text-xs text-slate-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {submittedRecord.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <span className="text-slate-500 block">Expéditeur :</span>
              <span className="font-medium text-slate-800">{submittedRecord.fullName} ({submittedRecord.email})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Objet & Catégorie :</span>
              <span className="font-medium text-slate-800">{submittedRecord.subject} • {submittedRecord.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Dossier de stockage :</span>
              <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
                Formulaire de Contact - Messages
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Pièce jointe :</span>
              <span className="font-medium text-slate-800">
                {submittedRecord.attachmentName ? submittedRecord.attachmentName : 'Aucune'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {submittedRecord.driveViewLink ? (
            <a
              id="open-in-drive-button"
              href={submittedRecord.driveViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir dans Google Drive</span>
            </a>
          ) : (
            <div className="text-xs text-slate-500 italic">
              Fichier synchronisé avec l'identifiant {submittedRecord.driveFileId}
            </div>
          )}

          <button
            id="send-another-message-button"
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Rédiger un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Introduction Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Envoyez-nous un message
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Pour toute question sur les actions d'ADMDO, un projet pour Médina Diakha Ouly ou une demande de partenariat, complétez le formulaire ci-dessous.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
              <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sauvegarde Drive
            </span>
          </div>
        </div>

        {/* Status banner for Google Drive auth */}
        {!auth.isAuthenticated && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-amber-950">Synchronisation automatique avec Google Drive</p>
              <p className="text-amber-800 mt-0.5">
                Les messages et pièces jointes sont archivés directement dans le dossier dédié de votre Google Drive. Une authentification Google sécurisée vous sera demandée lors de l'envoi.
              </p>
            </div>
          </div>
        )}

        {serverError && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">Une erreur est survenue :</p>
              <p className="text-rose-700 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form
        id="contact-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6"
        noValidate
      >
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName-input"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Nom & Prénom <span className="text-rose-500">*</span>
            </label>
            <input
              id="fullName-input"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="ex: Aminata Diallo"
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 transition-all focus:bg-white focus:outline-none ${
                errors.fullName
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Adresse email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ex: aminata.diallo@exemple.org"
              className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 transition-all focus:bg-white focus:outline-none ${
                errors.email
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone-input"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Téléphone <span className="text-slate-400 text-xs font-normal normal-case">(optionnel)</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="ex: +221 77 000 00 00 / +33 6..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="category-select"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Catégorie de la demande <span className="text-rose-500">*</span>
            </label>
            <select
              id="category-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
            Niveau d'urgence / Priorité
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p.label;
              return (
                <button
                  key={p.label}
                  id={`priority-btn-${p.label.toLowerCase()}`}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p.label })}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-[10px] text-slate-500">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject-input"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
          >
            Objet du message <span className="text-rose-500">*</span>
          </label>
          <input
            id="subject-input"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="ex: Proposition de projet hydraulique / Soutien aux écoles"
            className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 transition-all focus:bg-white focus:outline-none ${
              errors.subject
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
            }`}
          />
          {errors.subject && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
            </p>
          )}
        </div>

        {/* Message Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="message-textarea"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Votre Message <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {formData.message.length} caractères
            </span>
          </div>
          <textarea
            id="message-textarea"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Écrivez ici les détails de votre demande ou proposition..."
            className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 transition-all focus:bg-white focus:outline-none resize-y ${
              errors.message
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
            }`}
          />
          {errors.message && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
            </p>
          )}
        </div>

        {/* Attachment Upload (Drag-and-Drop + Manual Click) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Pièce jointe <span className="text-slate-400 text-xs font-normal normal-case">(optionnel, max 15 Mo)</span>
          </label>

          <input
            ref={fileInputRef}
            id="attachment-file-input"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!attachment ? (
            <div
              id="file-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Glissez-déposez un document ici, ou <span className="text-emerald-700 underline">parcourez vos fichiers</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, Word, Excel, images (PNG, JPG) jusqu'à 15 Mo
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-800 truncate">{attachment.name}</p>
                  <p className="text-xs text-slate-500">
                    {(attachment.size / (1024 * 1024)).toFixed(2)} Mo • Fichier prêt à être envoyé
                  </p>
                </div>
              </div>
              <button
                id="remove-attachment-button"
                type="button"
                onClick={() => setAttachment(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                title="Supprimer la pièce jointe"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {errors.attachment && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.attachment}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-1 w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              J'autorise l'enregistrement et l'archivage de ce message et de ses pièces jointes dans le dossier sécurisé Google Drive de l'association pour le traitement de ma demande.
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.consent}
            </p>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FolderCheck className="w-4 h-4 text-emerald-600" />
            <span>Stockage cloud Google Drive sécurisé</span>
          </div>

          <button
            id="submit-contact-form-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>{submitStep || 'Envoi en cours...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Envoyer et enregistrer sur Drive</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
