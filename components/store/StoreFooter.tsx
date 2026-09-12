// components/store/StoreFooter.tsx
import Link from "next/link";
import { FiFacebook, FiInstagram, FiYoutube, FiTwitter, FiMapPin } from "react-icons/fi";

const columns = [
  {
    title: "Información",
    links: [
      "Sobre Nosotros",
      "Términos y Condiciones",
      "Política de Privacidad",
      "Garantía de Hardware",
      "Trabaja con Nosotros",
    ],
  },
  {
    title: "Atención al Cliente",
    links: [
      "Seguimiento de Pedido",
      "Centro de Ayuda FAQ",
      "Cambios y Devoluciones",
      "Métodos de Pago y Sitios",
      "Libro de Reclamaciones",
    ],
  },
];

export default function StoreFooter() {
  return (
    <footer className="w-full bg-slate-900 text-white mt-12">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Columna 1: Logo + descripción */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/logotipo.png"
              alt="NEXORA STORE"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Tu tienda de tecnología gamer de alto rendimiento. Envíos a todo el Perú con garantía oficial.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            TIENDA ONLINE ACTIVA
          </div>
        </div>

        {/* Columnas 2 y 3 */}
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Columna 4: Contacto */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
            Contacto
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <a href="mailto:ventas@nexora.pe" className="hover:text-cyan-400 transition-colors">
                ventas@nexora.pe
              </a>
            </li>
            <li>
              <a href="tel:+51987654321" className="hover:text-cyan-400 transition-colors">
                +51 987 654 321
              </a>
            </li>
            <li>Lun - Sáb: 09:00 - 22:00</li>
            <li>Lima, Perú</li>
          </ul>
        </div>

        {/* Columna 5: Redes */}
        <div>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
            Comunidad Gamer
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="#" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                <FiFacebook className="w-4 h-4" />
                Discord Server
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                <FiInstagram className="w-4 h-4" />
                75.5k @nexorastore.pe
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                <FiYoutube className="w-4 h-4" />
                @nexoragaming
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                <FiTwitter className="w-4 h-4" />
                @nexora_gaming
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © 2026 NEXORA Ecommerce Gaming Tech Perú S.A.C. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Términos de Servicio
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Privacidad
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}