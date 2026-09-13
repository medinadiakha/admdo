import React, { useState } from 'react';
import {
  Heart,
  Wallet,
  Globe,
  Shield,
  ExternalLink,
  CheckCircle,
  Copy,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DonationButtonConfig } from '../types';
import { ShareButton } from './ShareButton';

interface DonationsPageProps {
  donationButtons: DonationButtonConfig[];
  onNavigateContact?: () => void;
}

export const DonationsPage: React.FC<DonationsPageProps> = ({
  donationButtons = [],
  onNavigateContact,
}) => {
  const activeButtons = (donationButtons || []).filter((b) => b.isActive);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'wallet':
        return <Wallet className="w-6 h-6 text-emerald-600" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-amber-600" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'heart':
      default:
        return <Heart className="w-6 h-6 text-rose-500" />;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>Solidarité & Soutien Transparent</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Plateforme Officielle des Dons & Cotisations
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-base sm:text-lg">
              Chaque contribution est affectée directement aux projets d’eau potable, d’éducation et de santé de Medina Diakha Wouly avec traçabilité et compte rendu public.
            </p>
          </div>

          <div className="self-start sm:self-center">
            <ShareButton
              pageTitle="Faire un don à l'ADMDO - Medina Diakha Wouly"
              pagePath="dons"
              label="Partager cette page de dons"
              variant="primary"
            />
          </div>
        </div>

        {/* Highlighted Donation Buttons configured by Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeButtons.map((btn) => (
            <div
              key={btn.id}
              id={`donation-card-${btn.id}`}
              className={`relative rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between border ${
                btn.isPrimary
                  ? 'bg-white border-emerald-500/80 shadow-lg ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
              }`}
            >
              {btn.isPrimary && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Recommandé
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                    {getIcon(btn.iconType)}
                  </div>
                  {btn.badge && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {btn.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{btn.label}</h3>

                {btn.description && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {btn.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`btn-open-donation-${btn.id}`}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-95 text-center ${
                    btn.isPrimary
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Ouvrir {btn.platformName}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Plateforme : {btn.platformName}</span>
                  <ShareButton
                    pageTitle={`${btn.label} - ADMDO`}
                    pagePath={`dons#donation-card-${btn.id}`}
                    label="Partager"
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bank & Mobile Reference Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Informations Officielles de l’Association ADMDO
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                L’Association pour le Développement de Medina Diakha Wouly garantit la transparence intégrale des fonds collectés.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Numéro Mobile Money Référent (Sénégal)
              </span>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-mono font-semibold text-slate-800 text-sm sm:text-base">
                  +221 77 000 11 22
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('+221 77 000 11 22', 'phone')}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:text-emerald-800 p-1 rounded"
                >
                  {copiedAccount === 'phone' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Au nom du Trésorier Général ou du Président officiel ADMDO.
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Email Officiel pour Reçus et Attestations
              </span>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-mono font-semibold text-slate-800 text-xs sm:text-sm truncate mr-2">
                  admdo.association@gmail.com
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('admdo.association@gmail.com', 'email')}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:text-emerald-800 p-1 rounded flex-shrink-0"
                >
                  {copiedAccount === 'email' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Envoyez la capture ou la référence de votre transfert pour recevoir votre reçu officiel.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Vous êtes une organisation partenaire, une ONG ou une collectivité ?</span>
            </div>
            {onNavigateContact && (
              <button
                type="button"
                onClick={onNavigateContact}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Contacter directement le bureau exécutif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
