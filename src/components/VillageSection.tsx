import React from 'react';
import {
  MapPin,
  Globe,
  Heart,
  Users2,
  Building,
  Quote,
} from 'lucide-react';

export const VillageSection: React.FC = () => {
  return (
    <section id="village-section" className="py-16 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Notre Territoire & Notre Histoire</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Médina Diakha Ouly, un village d’histoire, de valeurs et d’entraide
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Situé au cœur d’une région riche en traditions et en hospitalité, le village de <strong>Médina Diakha Ouly</strong> incarne l’esprit de solidarité séculaire. Les générations s’y transmettent l’amour de la terre, le respect des aînés et le désir d’un progrès partagé.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Face aux défis du monde contemporain (accès à l’eau, désertification, modernisation des écoles et des soins), les habitants ont choisi de s’unir pour prendre en main leur destin, main dans la main avec la diaspora.
            </p>

            {/* 3 Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                  <Heart className="w-4 h-4" />
                  <span>Solidarité</span>
                </div>
                <p className="text-xs text-slate-500">
                  L’entraide communautaire au cœur de chaque décision.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Diaspora unie</span>
                </div>
                <p className="text-xs text-slate-500">
                  Un pont permanent entre les ressortissants et le village.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                  <Building className="w-4 h-4" />
                  <span>Pérennité</span>
                </div>
                <p className="text-xs text-slate-500">
                  Des infrastructures solides qui durent pour nos enfants.
                </p>
              </div>
            </div>
          </div>

          {/* Highlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users2 className="w-40 h-40" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <Quote className="w-5 h-5" />
                </div>

                <blockquote className="text-base sm:text-lg font-medium leading-relaxed italic text-emerald-50">
                  « Le développement durable ne s’importe pas : il naît de l’engagement sincère des fils et des filles de notre communauté, soutenus par des partenaires fraternels et bienveillants. »
                </blockquote>

                <div className="pt-4 border-t border-emerald-700/50">
                  <p className="text-sm font-bold text-white">
                    Bureau de l’Association ADMDO
                  </p>
                  <p className="text-xs text-emerald-300">
                    Association pour le développement de Médina Diakha Ouly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
