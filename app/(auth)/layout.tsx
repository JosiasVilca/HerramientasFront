// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen difuminada */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md scale-110"
        style={{ backgroundImage: "url('/fondo.jpg')" }}
      ></div>

      {/* Capa oscura para que el formulario resalte */}
      <div className="absolute inset-0 bg-slate-900/60"></div>

      {/* Contenido */}
      <div className="relative z-10 w-full flex justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}