// app/(legal)/layout.tsx
// Páginas legales públicas (política de privacidad y eliminación de datos).
// Viven fuera de los grupos (store) y (dashboard) a propósito: esos layouts
// redirigen a /login cuando no hay sesión, y estas URLs deben ser accesibles
// de forma anónima (requisito de Meta para publicar la app de Facebook).
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logotipo.png"
              alt="NEXORA STORE"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          {children}
        </article>
      </main>

      <footer className="w-full border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 NEXORA STORE &amp; Logistics. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacidad" className="hover:text-purple-600 transition-colors">
              Privacidad
            </Link>
            <span>•</span>
            <Link
              href="/eliminacion-de-datos"
              className="hover:text-purple-600 transition-colors"
            >
              Eliminación de datos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
