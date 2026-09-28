import React from "react";
import { TrackingEventDTO } from "@/types/tracking";

export default function TrackingTimeline({ history }: { history: TrackingEventDTO[] }) {
  if (!history || history.length === 0) return null;

  // Sort so most recent event displays on top
  const sortedHistory = [...history].sort((a, b) => String(b.id || "").localeCompare(String(a.id || "")));

  return (
    <section className="bg-card border border-border/80 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="border-b border-border/60 pb-4 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Historial de Movimientos
        </h2>
        <p className="text-sm font-semibold text-foreground mt-0.5">Bitácora de Eventos Logísticos</p>
      </div>
      
      <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-border">
        {sortedHistory.map((event, idx) => {
          const isLatest = idx === 0;
          return (
            <div key={event.id || idx} className="relative flex gap-5 items-start">
              <div 
                className={`w-3.5 h-3.5 mt-1 rounded-full z-10 shrink-0 border-2 border-slate-900 ${
                  isLatest 
                    ? "bg-purple-500 ring-4 ring-purple-500/30" 
                    : "bg-slate-600"
                }`} 
              />
              <div className="space-y-1">
                <p className={`text-sm ${isLatest ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium bg-muted px-2 py-0.5 rounded">{event.timestamp}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <span className="uppercase tracking-wider font-semibold text-foreground">{event.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}