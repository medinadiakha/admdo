import React from 'react';
import {
  Droplets,
  BookOpen,
  HeartPulse,
  Sprout,
  CheckCircle2,
  ArrowRight,
  Sun,
  ShieldCheck,
} from 'lucide-react';

interface ActionsSectionProps {
  onNavigateToContact: (subject?: string) => void;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({ onNavigateToContact }) => {
  const projects = [
    {
      id: 'eau',
      title: 'Accès pérenne à l’Eau Potable',
      icon: Droplets,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200/70',
      badge: 'Priorité Vitale',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      description:
        'L’accès régulier à une eau saine est le fondement de toute santé et du développement à Médina Diakha Ouly. Nos initiatives visent à sécuriser et étendre le réseau d’eau.',
      points: [
        'Maintenance et équipement solaire des forages et pompes existantes',
        'Extension des canalisations vers les quartiers périphériques',
        'Aménagement de points d’eau pour le cheptel et les jardins collectifs',
      ],
      ctaText: 'Participer au projet Eau',
    },
    {
      id: 'education',
      title: 'Éducation & Réussite Scolaire',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
      badge: 'Avenir des Jeunes',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description:
        'Offrir aux enfants de Médina Diakha Ouly les meilleures conditions d’apprentissage et lutter contre le décrochage scolaire en milieu rural.',
      points: [
        'Distribution annuelle de kits scolaires complets pour tous les écoliers',
        'Rénovation des salles de classe, des toitures et du mobilier scolaire',
        'Sensibilisation et soutien appuyé à la scolarisation des jeunes filles',
      ],
      ctaText: 'Soutenir l’Éducation',
    },
    {
      id: 'sante',
      title: 'Santé & Prévention Médicale',
      icon: HeartPulse,
      color: 'bg-rose-50 text-rose-700 border-rose-200/70',
      badge: 'Bien-être Communautaire',
      badgeColor: 'bg-rose-100 text-rose-800',
      description:
        'Soutenir les structures de soins primaires pour éviter les complications médicales et faciliter les consultations d’urgence.',
      points: [
        'Approvisionnement régulier en médicaments essentiels de première ligne',
        'Amélioration des conditions d’accueil de la maternité et des soins pédiatriques',
        'Campagnes de dépistage et de sensibilisation à l’hygiène et à l’assainissement',
      ],
      ctaText: 'Contribuer à la Santé',
    },
    {
      id: 'agriculture',
      title: 'Maraîchage & Développement Économique',
      icon: Sprout,
      color: 'bg-amber-50 text-amber-700 border-amber-200/70',
      badge: 'Autonomie & Emploi',
      badgeColor: 'bg-amber-100 text-amber-800',
      description:
        'Créer des opportunités économiques locales en valorisant le travail des femmes et des jeunes à travers des activités agro-pastorales durables.',
      points: [
        'Clôture et équipement de jardins maraîchers pour le groupement des femmes',
        'Fourniture de semences adaptées et formation aux techniques d’irrigation goutte-à-goutte',
        'Plantation d’arbres fruitiers (anacardiers, manguiers) et reboisement communautaire',
      ],
      ctaText: 'Accompagner le Maraîchage',
    },
  ];

  return (
    <section id="actions-section" className="py-16 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Chantiers & Engagements
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Nos actions prioritaires sur le terrain
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Chaque action de l’ADMDO est décidée en concertation étroite avec les villageois
            et les comités de sages pour répondre aux besoins réels et urgents.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => {
            const Icon = proj.icon;
            return (
              <div
                key={proj.id}
                id={`project-card-${proj.id}`}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${proj.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${proj.badgeColor}`}
                    >
                      {proj.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {proj.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {proj.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Projet suivi par le bureau ADMDO
                  </span>

                  <button
                    type="button"
                    onClick={() => onNavigateToContact(proj.title)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>{proj.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
