// components/store/Brands.tsx
import Reveal from "@/components/ui/reveal";

const brands = [
  "Logitech G",
  "Razer",
  "SteelSeries",
  "HyperX",
  "Corsair",
  "ROG",
  "Glorious",
  "Zowie",
];

export default function Brands() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            Marcas en catálogo
          </h2>
          <p className="mt-3 max-w-sm text-base text-muted-foreground">
            Periféricos y componentes de las marcas que se usan en competencia,
            con stock real en Perú.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
            {brands.map((brand) => (
              <li
                key={brand}
                className="text-lg font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              >
                {brand}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
