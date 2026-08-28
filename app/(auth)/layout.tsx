import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-slate-50/50 dark:bg-zinc-950 font-sans antialiased overflow-x-hidden">
      {/* Left Side: Graphic & Quote (Hidden on mobile) */}
      <div className="hidden md:flex relative flex-col justify-between p-12 text-white overflow-hidden min-h-screen">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105" 
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxdJd1nb7sAndSVoJ765uscEBJtwTIdjDrH3NIFF8W4CKcxLdAyU9xHE-E46Oa7jEZFgfUzDH67B7VDS391NfYANLq07AwdgyeZEt_JB2ItxMK8MllVDOP9IKNLO6LmVi4MP7oFtZhCZ1ABu2UsD7fjIfessyx3ecMHFjz_uKPf9nhjNN0Whxryd8BmFXFe7YSIQ_3KKx2L18fkFH9P0W9-K9tBg1tqZ1fFR33Cyroyckr6Iv8h1cb')` 
          }}
        ></div>
        
        {/* Modern dark gradient overlay to guarantee readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-950/40 z-10"></div>
        
        {/* Top Branding Logo */}
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

        {/* Bottom Quote / Concept */}
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
      
      {/* Right Side: Form Container */}
      <div className="w-full flex items-center justify-center p-6 bg-slate-50/50 dark:bg-zinc-950 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md mx-auto py-8">
          
          {/* Mobile Header Branding */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden justify-center">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <span className="font-bold text-xl text-zinc-900 dark:text-white">
              SwiftLogix
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
