import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp, Bell, CheckCircle2 } from 'lucide-react';
import { MeetingItem } from '../types';

interface MeetingsSectionProps {
  meetingsList: MeetingItem[];
  onOpenAdmin: () => void;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({ meetingsList = [], onOpenAdmin }) => {
  const [expandedId, setExpandedId] = useState<string | null>(meetingsList?.[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const upcomingMeetings = (meetingsList || []).filter((m) => m.status === 'upcoming');
  const pastMeetings = (meetingsList || []).filter((m) => m.status === 'completed');

  return (
    <section id="reunions" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2 border border-blue-200">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Agenda & Concertation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Réunions & Assemblées de l’ADMDO
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Participez aux décisions pour l'avenir de Medina Diakha Wouly, en direct au village ou en visio.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-xs font-bold px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <span>+ Planifier une réunion</span>
          </button>
        </div>

        {/* Meetings List */}
        {upcomingMeetings.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">Aucune réunion programmée pour le moment.</p>
            <p className="text-xs text-slate-400 mt-1">
              Les prochaines assemblées générales ou réunions du bureau seront publiées ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMeetings.map((meet) => {
              const isExpanded = expandedId === meet.id;
              return (
                <div
                  key={meet.id}
                  className="bg-slate-50/80 rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                >
                  <div
                    onClick={() => toggleExpand(meet.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          À venir
                        </span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {meet.date}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {meet.time}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {meet.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {meet.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {meet.targetAudience}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-bold text-emerald-700 hover:underline">
                        {isExpanded ? 'Masquer détails' : 'Voir ordre du jour'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Agenda */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-200/80 bg-white">
                      <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Ordre du jour & Déroulement
                        </h4>
                        <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {meet.agenda || 'L’ordre du jour sera communiqué prochainement.'}
                        </pre>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                        <span>
                          Organisé par <strong>{meet.organizerName}</strong> ({meet.organizerRole})
                        </span>

                        <a
                          href="mailto:admdo.association@gmail.com?subject=Confirmation présence réunion"
                          className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Confirmer ma participation par email</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
