// components/store/StoreFooter.tsx
import Link from "next/link";

const columns = [
  {
    title: "Comprar",
    links: [
      { label: "Catálogo completo", href: "/productos" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Carrito", href: "/carrito" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Seguimiento de pedido", href: "/tracking-list" },
      { label: "Términos del servicio", href: "/terms" },
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Eliminación de datos", href: "/eliminacion-de-datos" },
    ],
  },
];

export default function StoreFooter() {
  return (
    <footer className="mt-8 w-full bg-[#0b1c30] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:px-8 lg:py-16">
        {/* Marca */}
        <div>
          <img
            src="/logotipo.png"
            alt="NEXORA STORE"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-base leading-relaxed text-white/60">
            Tecnología gamer original, con despacho a todo el Perú y garantía
            oficial.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
            <span className="h-2 w-2 rounded-full bg-[#35c46a]" aria-hidden="true" />
            Tienda online activa
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contacto */}
        <div>
          <h2 className="text-sm font-semibold text-white">Contacto</h2>
          <ul className="mt-4 space-y-2.5 text-base text-white/60">
            <li>
              <a
                href="mailto:ventas@nexora.pe"
                className="transition-colors hover:text-white"
              >
                ventas@nexora.pe
              </a>
            </li>
            <li>
              <a href="tel:+51987654321" className="transition-colors hover:text-white">
                +51 987 654 321
              </a>
            </li>
            <li>Lun a sáb, 09:00 – 22:00</li>
            <li>Lima, Perú</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#081426]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-5 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 NEXORA Ecommerce Gaming Tech Perú S.A.C.</p>
          <p>Precios en soles peruanos, incluido IGV.</p>
        </div>
      </div>
    </footer>
  );
}
