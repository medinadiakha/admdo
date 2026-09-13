import React from 'react';
import {
  ArrowRight,
  Droplets,
  BookOpen,
  HeartPulse,
  Users,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="accueil-section" className="relative pt-6 pb-16 lg:pb-24">
      {/* Association Banner Badge */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Médina Diakha Ouly • Région naturelle & Communauté solidaire</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
          Ensemble pour le développement durable de{' '}
          <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-8">
            Médina Diakha Ouly
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
          L’<strong>ADMDO</strong> réunit les résidents du village, les amis et la diaspora sénégalaise
          pour améliorer le quotidien des familles : accès à l’eau potable, soutien aux écoles, santé et autonomie économique.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            id="hero-discover-actions-button"
            type="button"
            onClick={() => onNavigate('actions')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-sm font-semibold rounded-2xl shadow-xs transition-all"
          >
            <span>Découvrir nos projets</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-contact-button"
            type="button"
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-2xl border border-slate-300 shadow-2xs transition-all"
          >
            <span>Nous contacter</span>
          </button>

          <button
            id="hero-support-button"
            type="button"
            onClick={() => onNavigate('soutenir')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-sm font-semibold rounded-2xl border border-emerald-200/80 transition-all"
          >
            <span>Nous soutenir</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars of impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 border border-cyan-200/60 group-hover:scale-105 transition-transform">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Eau & Forages</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Approvisionnement pérenne en eau potable pour les foyers, les abreuvoirs pastoraux et les jardins du village.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200/60 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Éducation & Jeunesse</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kits de fournitures, réhabilitation des salles de classe, bourses et tutorat pour la réussite des élèves.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 border border-rose-200/60 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Santé & Prévention</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Appui au poste de santé local, matériel de premiers soins, trousses médicales et hygiène communautaire.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200/60 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Solidarité & Diaspora</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Fédération des énergies entre les habitants et les ressortissants de la diaspora pour un impact concret.
          </p>
        </div>
      </div>
    </section>
  );
};
