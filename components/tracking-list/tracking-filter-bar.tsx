import React from "react";
import { Search } from "lucide-react";

interface TrackingFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function TrackingFilterBar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}: TrackingFilterBarProps) {
  const statuses = ["TODOS", "EN TRÁNSITO", "ENTREGADO", "INCIDENCIA", "EN PREPARACIÓN"];

  return (
    <section className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por N° de pedido o Código de seguimiento..."
            className="w-full h-12 pl-12 pr-4 bg-[#070b0e] border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-500 hover:text-slate-300"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                selectedStatus === status
                  ? "bg-[#00f5ff]/15 text-[#00f5ff] border-[#00f5ff]/50 shadow-md shadow-[#00f5ff]/10"
                  : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}