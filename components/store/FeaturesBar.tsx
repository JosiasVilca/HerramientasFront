// components/store/FeaturesBar.tsx
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: FiTruck,
    title: "Envío Prioritario 24H",
    description: "Para Lima y principales ciudades del Perú",
  },
  {
    icon: FiShield,
    title: "Garantía Oficial 2 Años",
    description: "Todos nuestros productos con respaldo directo",
  },
  {
    icon: FiRefreshCw,
    title: "Hasta 12 Cuotas Sin Interés",
    description: "Con las principales tarjetas del mercado",
  },
  {
    icon: FiHeadphones,
    title: "Soporte Gamer 24/7",
    description: "Atención por Discord y WhatsApp",
  },
];

export default function FeaturesBar() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
