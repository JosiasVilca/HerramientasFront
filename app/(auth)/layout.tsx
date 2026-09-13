import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900/60 font-sans antialiased overflow-hidden">
      
      {/* Left Side: Graphic & Quote (Hidden on mobile) */}
      <div className="hidden md:flex relative flex-col justify-between p-12 text-white overflow-hidden min-h-screen">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
          style={{
            backgroundImage: `url('https://imgs.search.brave.com/NnsabbqhMfUj0KBmMQw3dYTWHJijIbkcxHmVDGHINKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI3/MjU2MjU3OC9lcy9m/b3RvL2NvdXJpZXIt/Y2hlY2tpbmctdGhl/LXBhcmNlbC1mb3It/ZGVsaXZlcnkuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPXI4/VmFyVHZGeFdINUt4/Z3lYZ0ZpSTBVNTNk/SGtNLTBoenJtRjRr/NVYwYkk9')`
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-950/40 z-10"></div>

        <div className="relative z-20 flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-inner">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-200">
            SwiftLogix
          </span>
        </div>

        <div className="relative z-20 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 mb-6 text-zinc-100 shadow-sm animate-pulse">
            Logística Inteligente
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight bg-gradient-to-b from-white to-zinc-200 bg-clip-text text-transparent">
            "Innovación que mueve el mundo."
          </h2>
          <p className="text-zinc-300 text-base leading-relaxed font-light font-sans">
            Monitorea, gestiona y acelera tu cadena de suministro desde un solo panel integrado con datos en tiempo real.
          </p>
        </div>
      </div>

      {/* Right Side: Form Container with Partner's Background */}
      <div className="relative w-full flex items-center justify-center p-6 min-h-screen overflow-hidden">
        
        {/* Background from Partner's design */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-md scale-110"
          style={{ backgroundImage: "url('/fondo.jpg')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-slate-900/60"></div>

        <div className="relative z-10 w-full max-w-md mx-auto py-8">
          {/* Mobile Header Branding */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden justify-center text-white">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <span className="font-bold text-xl text-white">
              SwiftLogix
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}