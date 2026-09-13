import React from 'react';
import {
  HeartHandshake,
  UserPlus,
  Briefcase,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface SupportSectionProps {
  onNavigateToContact: (category: string) => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ onNavigateToContact }) => {
  const options = [
    {
      icon: UserPlus,
      title: 'Devenir Membre ou Bénévole',
      category: 'Adhésion & Bénévolat',
      badge: 'Engagement Humain',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Rejoignez notre communauté engagée. Que vous soyez au Sénégal ou dans la diaspora, vos idées, votre énergie et vos compétences font grandir l’association.',
      highlights: [
        'Participation aux assemblées et prises de décision',
        'Partage de compétences (santé, enseignement, gestion)',
        'Réseau chaleureux de solidarité intergénérationnelle',
      ],
      btnText: 'Rejoindre l’association',
    },
    {
      icon: Briefcase,
      title: 'Proposer un Partenariat',
      category: 'Partenariat & Mécénat',
      badge: 'Institutionnel & Entreprises',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      description:
        'Vous représentez une ONG, une collectivité, une fondation ou une entreprise ? Bâtissons ensemble des projets d’intérêt public durables et vérifiables.',
      highlights: [
        'Conventions de partenariat transparentes',
        'Rapports d’exécution et suivi photographique régulier',
        'Impact direct et mesurable sur les bénéficiaires',
      ],
      btnText: 'Initier un partenariat',
    },
    {
      icon: Gift,
      title: 'Faire un Don ou Soutenir un Projet',
      category: 'Don ou Soutien financier',
      badge: 'Impact Immédiat',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description:
        'Chaque don est intégralement alloué aux chantiers prioritaires (kits scolaires, équipement du forage, soins d’urgence au dispensaire).',
      highlights: [
        'Attestation de don et traçabilité financière rigoureuse',
        'Possibilité de flécher votre soutien vers un projet spécifique',
        'Témoignages et bilans partagés aux donateurs',
      ],
      btnText: 'Proposer un soutien',
    },
  ];

  return (
    <section id="soutenir-section" className="py-16 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Solidarité Active
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Comment vous pouvez faire la différence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            L’ADMDO repose sur l’action bénévole, la clarté financière et l’amour du village. Découvrez les différentes manières de prendre part à cette aventure humaine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${opt.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {opt.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {opt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {opt.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    {opt.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigateToContact(opt.category)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <span>{opt.btnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
