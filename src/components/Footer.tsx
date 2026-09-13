import React from 'react';
import {
  HeartHandshake,
  Mail,
  MapPin,
  Shield,
  HardDrive,
  ArrowUp,
  Phone,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { FooterConfig } from '../types';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenInbox: () => void;
  footerConfig?: FooterConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenInbox,
  footerConfig,
}) => {
  const config: FooterConfig = {
    email: 'admdo.association@gmail.com',
    phone: '+221 77 000 11 22',
    address: 'Medina Diakha Wouly, Arrondissement de Koussanar, Région de Tambacounda, Sénégal',
    description:
      "Association pour le Développement de Médina Diakha Wouly. Fédération des habitants et de la diaspora pour l'accès à l'eau potable, l'éducation, la santé et l'entraide solidaire.",
    copyrightText: `© ${new Date().getFullYear()} ADMDO — Association pour le Développement de Médina Diakha Wouly. Tous droits réservés.`,
    ...footerConfig,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight block">
                  ADMDO
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Médina Diakha Wouly
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              {config.description ||
                "Association pour le Développement de Médina Diakha Wouly. Fédération des habitants et de la diaspora pour l'accès à l'eau, l'éducation, la santé et l'entraide solidaire."}
            </p>

            {/* Social links if configured */}
            {(config.whatsapp || config.facebook || config.youtube) && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {config.whatsapp && (
                  <a
                    href={
                      config.whatsapp.startsWith('http')
                        ? config.whatsapp
                        : `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 text-[11px] font-bold transition"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {config.facebook && (
                  <a
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 text-blue-400 hover:bg-blue-900 text-[11px] font-bold transition"
                  >
                    <span>Facebook</span>
                  </a>
                )}
                {config.youtube && (
                  <a
                    href={config.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900 text-[11px] font-bold transition"
                  >
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}

            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Organisation associative à but non lucratif</span>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('accueil')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Accueil & Vidéos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('actions')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Nos chantiers prioritaires
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('village')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Le village & La communauté
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('soutenir')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Adhésion & Cagnottes de dons
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('documents')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
                >
                  <FileText className="w-3 h-3" />
                  <span>Documents & Statuts officiels</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Formulaire de contact & Partenaires
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Drive */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Services & Gestion
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenInbox}
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Boîte de réception Google Drive</span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protection des données et transparence</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>Archivage sécurisé Firestore & Cloud</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact direct */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Secrétariat ADMDO
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Adresse email officielle :</span>
                  <a
                    href={`mailto:${config.email || 'admdo.association@gmail.com'}`}
                    className="text-emerald-400 hover:underline break-all"
                  >
                    {config.email || 'admdo.association@gmail.com'}
                  </a>
                </div>
              </div>

              {config.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-300 font-medium">Téléphone :</span>
                    <a
                      href={`tel:${config.phone.replace(/\s/g, '')}`}
                      className="text-slate-300 hover:text-white"
                    >
                      {config.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Localisation :</span>
                  <span className="text-slate-400">
                    {config.address || 'Médina Diakha Wouly, Sénégal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Haut de page</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>
            {config.copyrightText ||
              `© ${new Date().getFullYear()} ADMDO — Association pour le Développement de Médina Diakha Wouly. Tous droits réservés.`}
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              Chiffrement & Sécurité Google Cloud & Firebase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

