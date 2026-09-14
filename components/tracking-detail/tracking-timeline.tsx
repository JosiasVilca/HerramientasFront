import React from "react";
import { TrackingEventDTO } from "@/types/tracking";

export default function TrackingTimeline({ history }: { history: TrackingEventDTO[] }) {
  if (!history || history.length === 0) return null;

  // Ordenamos para que el evento más reciente salga arriba
  const sortedHistory = [...history].sort((a, b) => String(b.id).localeCompare(String(a.id)));

  return (
    <section className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
        Historial de Movimientos
      </h2>
      
      <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[21px] before:w-0.5 before:bg-slate-800">
        {sortedHistory.map((event, idx) => {
          const isLatest = idx === 0;
          return (
            <div key={event.id} className="relative flex gap-6 items-start">
              <div className={`w-3 h-3 mt-1.5 rounded-full z-10 shrink-0 ${isLatest ? 'bg-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'bg-slate-600'}`} />
              <div>
                <p className={`text-sm font-bold ${isLatest ? 'text-white' : 'text-slate-300'}`}>
                  {event.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-mono">{event.timestamp}</span>
                  <span className="text-slate-700">•</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{event.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}