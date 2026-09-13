// app/(store)/perfil/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiHeart,
  FiCreditCard,
  FiLogOut,
  FiEdit2,
  FiSave,
  FiChevronRight,
  FiCamera,
} from "react-icons/fi";

type TabId = "perfil" | "pedidos" | "direcciones" | "favoritos" | "pagos";

// Función para formatear el teléfono: +51 951 951 441
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  let numberPart = digits;
  if (digits.startsWith("51")) {
    numberPart = digits.slice(2);
  }

  numberPart = numberPart.slice(0, 9);

  const formatted = numberPart.replace(
    /(\d{3})(\d{0,3})(\d{0,3})/,
    (_, a, b, c) => {
      let result = a;
      if (b) result += ` ${b}`;
      if (c) result += ` ${c}`;
      return result;
    },
  );

  return `+51 ${formatted}`;
};

export default function PerfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabFromUrl = (searchParams.get("tab") as TabId) || "perfil";
  const [activeTab, setActiveTab] = useState<TabId>(tabFromUrl);

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+51 987 654 321",
    address: "Av. Javier Prado 1234, San Isidro, Lima",
    memberSince: "Enero 2025",
    avatar: "",
  });

  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("favorites");
    router.push("/login");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditedUser({ ...editedUser, avatar: result });
        setUser({ ...user, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: "perfil" as TabId, label: "Mi Perfil", icon: FiUser },
    { id: "pedidos" as TabId, label: "Mis Pedidos", icon: FiPackage },
    { id: "direcciones" as TabId, label: "Direcciones", icon: FiMapPin },
    { id: "favoritos" as TabId, label: "Favoritos", icon: FiHeart },
    { id: "pagos" as TabId, label: "Métodos de Pago", icon: FiCreditCard },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Inicio
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Mi Cuenta</span>
      </nav>

      {/* Header del perfil con avatar */}
      <div className="bg-gradient-to-r from-purple-600 to-cyan-400 rounded-3xl p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-extrabold text-2xl shrink-0 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              aria-label="Cambiar foto"
            >
              <FiCamera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              Hola, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-white/80">
              {user.email} · Miembro desde {user.memberSince}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white border border-slate-200 rounded-2xl p-4 h-fit sticky top-32">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-purple-50 text-purple-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
            <li className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </aside>

        {/* Panel */}
        <main className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          {activeTab === "perfil" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Mi Perfil
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition uppercase tracking-wider"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition uppercase tracking-wider"
                  >
                    <FiSave className="w-3.5 h-3.5" />
                    Guardar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition outline-none ${
                      isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                        : "border-slate-200 bg-slate-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition outline-none ${
                      isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                        : "border-slate-200 bg-slate-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    disabled={!isEditing}
                    placeholder="+51 999 999 999"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition outline-none ${
                      isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                        : "border-slate-200 bg-slate-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={editedUser.address}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, address: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition outline-none ${
                      isEditing
                        ? "border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                        : "border-slate-200 bg-slate-50 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                Mis Pedidos
              </h2>
              <div className="text-center py-12">
                <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">
                  Aún no tienes pedidos registrados.
                </p>
              </div>
            </div>
          )}

          {activeTab === "direcciones" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                Mis Direcciones
              </h2>
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                  Dirección Principal
                </p>
                <p className="text-sm text-slate-700">{user.address}</p>
              </div>
            </div>
          )}

          {activeTab === "favoritos" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                Mis Favoritos
              </h2>
              <Link
                href="/favoritos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition uppercase tracking-wider"
              >
                <FiHeart className="w-3.5 h-3.5" />
                Ver mi lista de deseos
              </Link>
            </div>
          )}

          {activeTab === "pagos" && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                Métodos de Pago
              </h2>
              <div className="text-center py-12">
                <FiCreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">
                  Aún no tienes métodos de pago guardados.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
