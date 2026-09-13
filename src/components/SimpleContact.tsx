import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface SimpleContactProps {
  onMessageSent?: (msg: { name: string; contact: string; subject: string; message: string; date: string }) => void;
}

export const SimpleContact: React.FC<SimpleContactProps> = ({ onMessageSent }) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const newMsg = {
        name: name.trim(),
        contact: contactInfo.trim() || 'Non renseigné',
        subject: subject.trim() || 'Message général',
        message: message.trim(),
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Store in local storage for the association manager
      try {
        const existing = JSON.parse(localStorage.getItem('admdo_messages') || '[]');
        localStorage.setItem('admdo_messages', JSON.stringify([newMsg, ...existing]));
      } catch (err) {
        console.error(err);
      }

      if (onMessageSent) {
        onMessageSent(newMsg);
      }

      setLoading(false);
      setSent(true);
      setName('');
      setContactInfo('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
          Écrire à l'association
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Remplissez ce formulaire tout simple, nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      {sent ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-emerald-900 mb-1">
            Message bien envoyé !
          </h4>
          <p className="text-sm text-emerald-700 mb-4">
            Merci pour votre prise de contact. Le bureau de l'ADMDO a bien reçu votre message.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-xs font-semibold px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-1">
              Votre Nom et Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Mamadou Diallo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-info" className="block text-sm font-semibold text-slate-700 mb-1">
                Email ou Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-info"
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Ex : mamadou@email.com ou 77 000 00 00"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-700 mb-1">
                Objet
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Adhésion, Don, Question..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-1">
              Votre Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message ici simplement..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          <button
            id="submit-contact-button"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {loading ? (
              <span>Envoi en cours...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Direct email link */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>Ou écrivez-nous directement par email :</span>
        <a
          href="mailto:admdo.association@gmail.com"
          className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>admdo.association@gmail.com</span>
        </a>
      </div>
    </div>
  );
};
