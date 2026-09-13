import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  Save,
  MessageCircle,
} from 'lucide-react';
import { FooterConfig } from '../types';

interface AdminFooterTabProps {
  footerConfig: FooterConfig;
  onSaveFooterConfig: (config: FooterConfig) => void;
}

export const AdminFooterTab: React.FC<AdminFooterTabProps> = ({
  footerConfig,
  onSaveFooterConfig,
}) => {
  const [email, setEmail] = useState(footerConfig.email || 'admdo.association@gmail.com');
  const [phone, setPhone] = useState(footerConfig.phone || '+221 77 000 11 22');
  const [address, setAddress] = useState(
    footerConfig.address ||
      'Medina Diakha Wouly, Arrondissement de Koussanar, Région de Tambacounda, Sénégal'
  );
  const [description, setDescription] = useState(
    footerConfig.description ||
      'L’Association pour le Développement de Medina Diakha Wouly (ADMDO) œuvre pour l’accès à l’eau potable, l’éducation, la santé et l’autonomisation économique.'
  );
  const [whatsapp, setWhatsapp] = useState(footerConfig.whatsapp || '+221 77 000 11 22');
  const [facebook, setFacebook] = useState(footerConfig.facebook || 'https://facebook.com');
  const [youtube, setYoutube] = useState(footerConfig.youtube || 'https://youtube.com');
  const [copyrightText, setCopyrightText] = useState(
    footerConfig.copyrightText ||
      '© 2026 ADMDO — Association pour le Développement de Medina Diakha Wouly. Tous droits réservés.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (footerConfig) {
      setEmail(footerConfig.email || 'admdo.association@gmail.com');
      setPhone(footerConfig.phone || '+221 77 000 11 22');
      setAddress(footerConfig.address || '');
      setDescription(footerConfig.description || '');
      setWhatsapp(footerConfig.whatsapp || '');
      setFacebook(footerConfig.facebook || '');
      setYoutube(footerConfig.youtube || '');
      setCopyrightText(footerConfig.copyrightText || '');
    }
  }, [footerConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFooterConfig({
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      description: description.trim(),
      whatsapp: whatsapp.trim(),
      facebook: facebook.trim(),
      youtube: youtube.trim(),
      copyrightText: copyrightText.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            Configuration du Pied de Page & Coordonnées Officielles
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnalisez les coordonnées de contact, la description institutionnelle et les liens officiels visibles au bas de chaque page.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle className="w-4 h-4" />
            <span>Enregistré dans Firebase !</span>
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                Adresse Email Officielle de l’ADMDO *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admdo.association@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Toutes les notifications de dons et messages partenaires pointent vers cette adresse.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Téléphone de Contact Principal *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 000 11 22"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Localisation & Siège de l’Association
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Medina Diakha Wouly, Arrondissement de Koussanar, Sénégal"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description Synthétique (Texte du pied de page)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentez brièvement la mission de l’association pour les visiteurs..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Social & Contact Links */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Réseaux & Liens de Communication
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Numéro ou Lien WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+221 77 000 11 22 ou lien chat"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Lien Page Facebook
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/admdo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-rose-600" />
                  Lien Chaîne YouTube
                </label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@admdo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Texte de Copyright
            </label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="© 2026 ADMDO. Tous droits réservés."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres du pied de page</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
