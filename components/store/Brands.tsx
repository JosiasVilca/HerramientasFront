// components/store/Brands.tsx
const brands = [
  "LOGITECH G",
  "RAZER",
  "STEELSERIES",
  "HYPERX",
  "CORSAIR",
  "ROG",
  "GLORIOUS",
  "ZOWIE",
];

export default function Brands() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <span className="text-xs font-bold text-cyan-600 tracking-widest uppercase mb-3">
          Partners Oficiales
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Marcas que confían en nosotros
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xl">
          Trabajamos directamente con los fabricantes líderes para garantizar
          hardware 100% original en Perú.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {brands.map((brand) => (
          <div
            key={brand}
            className="group bg-white border border-slate-200 rounded-xl py-4 px-3 flex items-center justify-center hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-extrabold text-slate-500 group-hover:text-purple-600 transition-colors tracking-wider text-center">
              {brand}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
