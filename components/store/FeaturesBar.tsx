// components/store/FeaturesBar.tsx
import Reveal from "@/components/ui/reveal";

const features = [
  {
    title: "Envío en 24 h",
    description: "Lima Metropolitana, con cobertura nacional para el resto del Perú.",
  },
  {
    title: "Garantía de 2 años",
    description: "Respaldo oficial del fabricante en cada producto del catálogo.",
  },
  {
    title: "Hasta 12 cuotas",
    description: "Con las principales tarjetas del mercado peruano.",
  },
  {
    title: "Soporte real",
    description: "Atención por WhatsApp y Discord, de lunes a sábado.",
  },
];

export default function FeaturesBar() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal>
        <h2 className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-muted-foreground">
          Comprar en NEXORA
        </h2>
      </Reveal>

      <div className="mt-8 lg:mt-10">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 60}>
            <div className="grid gap-2 py-3 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-4">
              <h3 className="text-[clamp(1.9rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground lg:col-span-8">
                {feature.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-4">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
