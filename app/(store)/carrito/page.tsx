'use client';

import React, { useState, useEffect } from 'react';

// Interfaces
interface CartItem {
  id: string;
  nombre: string;
  especificacion?: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface Pedido {
  codigoUnico: string;
  articulos: CartItem[];
  montoTotal: number;
  fechaCreacion: string;
  metodoPago: string;
  estado: 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado';
  direccion?: {
    nombre: string;
    direccion: string;
    referencia: string;
    telefono: string;
    nota: string;
  };
}

type ViewState = 'cart' | 'tracking';

export default function GestionCarritoYPedido() {
  const [isMounted, setIsMounted] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('cart');
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [metodoPago, setMetodoPago] = useState<string>('tarjeta');
  const [pedidoActual, setPedidoActual] = useState<Pedido | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('carrito_compras');
    if (storedCart) {
      try {
        setCarrito(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error al leer el carrito", e);
      }
    } else {
      setCarrito([
        {
          id: '1',
          nombre: 'Mouse Gaming ATK Leviathan Wireless',
          especificacion: 'Negro Midnight Mate • 38g (8000Hz)',
          precio: 389.00,
          cantidad: 1,
          imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80'
        },
        {
          id: '2',
          nombre: 'Teclado Wooting 60HE+ Hall Effect',
          especificacion: 'Switch Lekker L60 • Rapid Trigger',
          precio: 899.00,
          cantidad: 1,
          imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80'
        }
      ]);
    }
  }, []);

  if (!isMounted) return null;

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const envio = 0.00;
  const total = subtotal + envio;

  const cambiarCantidad = (id: string, delta: number) => {
    const nuevoCarrito = carrito.map(item => {
      if (item.id === id) {
        const nuevaCant = item.cantidad + delta;
        return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito_compras', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const eliminarProducto = (id: string) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito_compras', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleFinalizarCompra = () => {
    if (carrito.length === 0) return;

    const codigoAleatorio = `#ECO-${Math.floor(10000 + Math.random() * 90000)}`;
    const nuevoPedido: Pedido = {
      codigoUnico: codigoAleatorio,
      articulos: carrito,
      montoTotal: total,
      fechaCreacion: new Date().toLocaleDateString(),
      metodoPago: metodoPago,
      estado: 'Confirmado',
      direccion: {
        nombre: 'Carlos Mendoza Ramos',
        direccion: 'Av. José Larco 880, Dpto 502',
        referencia: 'Frente a Parque Kennedy',
        telefono: '+51 984 210 933',
        nota: 'Dejar en recepción con vigilante de turno.'
      }
    };

    const historial = JSON.parse(localStorage.getItem('user_orders') || '[]');
    localStorage.setItem('user_orders', JSON.stringify([nuevoPedido, ...historial]));

    setCarrito([]);
    localStorage.removeItem('carrito_compras');
    window.dispatchEvent(new Event('cartUpdated'));

    setPedidoActual(nuevoPedido);
    setViewState('tracking');
  };

  const obtenerDetallePago = (metodo: string) => {
    switch (metodo) {
      case 'tarjeta':
        return { titulo: 'Tarjeta de Crédito / Débito (Visa)', sub: '•••• •••• •••• 8920 (Aprobado)', badge: 'PAGADO' };
      case 'yape':
        return { titulo: 'Yape / Plin (Billetera Digital)', sub: 'Pago móvil verificado por QR', badge: 'PAGADO' };
      case 'efectivo':
        return { titulo: 'Pago Efectivo (CIP)', sub: 'Código CIP generado y registrado', badge: 'PENDIENTE DE PAGO' };
      case 'transferencia':
        return { titulo: 'Transferencia Bancaria BCP', sub: 'Cuenta Corriente Soles: 193-776211-0-12', badge: 'VERIFICANDO' };
      default:
        return { titulo: 'Tarjeta de Crédito', sub: '•••• •••• •••• 8920', badge: 'PAGADO' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <style jsx global>{`
        @keyframes bounceClick {
          0% { transform: scale(1); }
          30% { transform: scale(0.92); }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .btn-rebote:active {
          animation: bounceClick 0.35s ease-in-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        
        {viewState === 'cart' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-wide uppercase text-slate-900">
                  Gestión de Carrito y Pedido
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Revisa tus ítems seleccionados y elige tu método de pago antes de confirmar tu compra.
                </p>
              </div>
              <button 
                onClick={() => window.history.back()}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-wider"
              >
                ← Seguir Comprando
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Artículos en el paquete</h2>
                    <span className="text-xs font-medium text-slate-500">{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
                  </div>

                  {carrito.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      Tu carrito está vacío.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {carrito.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.imagen} 
                              alt={item.nombre} 
                              className="w-16 h-16 object-cover rounded-xl border border-slate-200" 
                            />
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">{item.nombre}</h3>
                              {item.especificacion && (
                                <p className="text-xs text-slate-400">{item.especificacion}</p>
                              )}
                              <p className="text-xs text-slate-500 mt-1">Precio uni: S/ {item.precio.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                              <button 
                                onClick={() => cambiarCantidad(item.id, -1)}
                                className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 text-sm font-semibold text-slate-800">{item.cantidad}</span>
                              <button 
                                onClick={() => cambiarCantidad(item.id, 1)}
                                className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-bold"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right min-w-[80px]">
                              <p className="font-black text-slate-900 text-sm">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                              <button 
                                onClick={() => eliminarProducto(item.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium mt-1 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Método de Pago</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'tarjeta', label: 'Tarjeta Crédito/Débito' },
                      { id: 'yape', label: 'Yape / Plin' },
                      { id: 'efectivo', label: 'Pago Efectivo' },
                      { id: 'transferencia', label: 'Transferencia BCP' },
                    ].map((metodo) => (
                      <button
                        key={metodo.id}
                        type="button"
                        onClick={() => setMetodoPago(metodo.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          metodoPago === metodo.id 
                            ? 'border-purple-600 bg-purple-50/50 text-purple-700 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        {metodo.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit space-y-6">
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-4 border-b border-slate-100">
                  Resumen de tu compra
                </h2>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-slate-900">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">Entrega <span className="text-xs text-slate-400 cursor-help" title="Envío estándar a domicilio">ℹ️</span></span>
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">GRATIS</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-base">Total</span>
                  <span className="font-black text-blue-600 text-xl">S/ {total.toFixed(2)}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <button 
                    disabled={carrito.length === 0}
                    onClick={handleFinalizarCompra}
                    className="w-full bg-[#0d1322] hover:bg-purple-600 btn-rebote disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-colors duration-200 tracking-wider uppercase text-xs flex items-center justify-center gap-2"
                  >
                    Finalizar Compra
                  </button>

                  <button 
                    onClick={() => setCarrito([])}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors tracking-wide uppercase text-xs"
                  >
                    Vaciar Carrito
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-100">
                  <p>✓ Transacción segura con cifrado local.</p>
                  <p>✓ Garantía oficial de 2 años incluida.</p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VISTA SEGUIMIENTO Y DETALLE DE ORDEN ACTUALIZADA */}
        {viewState === 'tracking' && pedidoActual && (() => {
          const infoPago = obtenerDetallePago(pedidoActual.metodoPago);
          return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
              
              {/* Cabecera Orden */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-6 bg-purple-600 rounded-sm"></span>
                  <div>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider text-slate-900">Detalle de la Orden</h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Orden: {pedidoActual.codigoUnico} • Fecha: {pedidoActual.fechaCreacion}</p>
                  </div>
                </div>
                <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider border border-purple-100">
                  {pedidoActual.articulos.length} Producto{pedidoActual.articulos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* SECCIÓN DE SEGUIMIENTO DEL PEDIDO (TIMELINE MODERNO) */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span>📦</span> SEGUIMIENTO DEL PEDIDO
                  </h3>
                  <span className="text-[11px] font-bold bg-purple-600 text-white px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                    En Proceso
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  
                  {/* Paso 1: Confirmado */}
                  <div className="relative flex items-start gap-4">
                    <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-100 flex items-center justify-center"></span>
                    <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">1. Pedido Confirmado</h4>
                        <span className="text-[10px] font-mono text-slate-400">Hoy • 10:24 AM</span>
                      </div>
                      <p className="text-xs text-slate-600">El pago fue verificado con éxito y la orden ingresó al sistema central.</p>
                    </div>
                  </div>

                  {/* Paso 2: En preparación */}
                  <div className="relative flex items-start gap-4 opacity-70">
                    <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100 flex items-center justify-center"></span>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">2. En Preparación / Empaquetado</h4>
                        <span className="text-[10px] font-mono text-slate-400">Pendiente</span>
                      </div>
                      <p className="text-xs text-slate-500">Productos siendo inspeccionados y asegurados con precinto de seguridad.</p>
                    </div>
                  </div>

                  {/* Paso 3: En camino */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100 flex items-center justify-center"></span>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">3. En Camino / Con el Repartidor</h4>
                        <span className="text-[10px] font-mono text-slate-400">Próximamente</span>
                      </div>
                      <p className="text-xs text-slate-500">El courier saldrá en ruta hacia tu dirección de entrega registrada.</p>
                    </div>
                  </div>

                  {/* Paso 4: Entregado */}
                  <div className="relative flex items-start gap-4 opacity-40">
                    <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100 flex items-center justify-center"></span>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">4. Entregado</h4>
                        <span className="text-[10px] font-mono text-slate-400">Completado</span>
                      </div>
                      <p className="text-xs text-slate-500">El pedido será recepcionado con firma digital y DNI del titular.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dirección de Entrega */}
              {pedidoActual.direccion && (
                <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>📍</span> Dirección de Entrega
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{pedidoActual.direccion.nombre}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {pedidoActual.direccion.direccion} ({pedidoActual.direccion.referencia})
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lima Metropolitana • Tel: {pedidoActual.direccion.telefono}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 mt-2">
                    <span className="font-semibold text-slate-700">Nota:</span> {pedidoActual.direccion.nota}
                  </div>
                </div>
              )}

              {/* Método de Pago Sincronizado */}
              <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>💳</span> Método de Pago Seleccionado
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{infoPago.titulo}</p>
                  <p className="text-xs font-mono text-slate-500">{infoPago.sub}</p>
                </div>
                <span className={`font-bold text-xs px-3 py-1 rounded-md border uppercase tracking-wider ${
                  infoPago.badge === 'PAGADO' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {infoPago.badge}
                </span>
              </div>

              {/* Artículos en el Paquete */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Artículos en el paquete</h3>
                <div className="space-y-3">
                  {pedidoActual.articulos.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
                      <div className="flex items-center gap-4">
                        <img src={item.imagen} alt={item.nombre} className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.nombre}</h4>
                          <p className="text-xs text-slate-400">{item.especificacion}</p>
                          <p className="text-xs font-medium text-slate-600 mt-1">Cant: {item.cantidad} unidad{item.cantidad !== 1 ? 'es' : ''}</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 text-sm">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales y Liquidación */}
              <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-100 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal de productos:</span>
                  <span className="font-semibold text-slate-900">S/ {pedidoActual.montoTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío Express Prioritario:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">GRATIS</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-base">Total (IGV 18% incluido):</span>
                  <span className="font-black text-blue-600 text-xl">S/ {pedidoActual.montoTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Acciones Finales */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => alert("Generando boleta de venta en formato PDF...")}
                  className="w-full bg-[#0d1322] hover:bg-purple-600 btn-rebote text-white font-bold py-3.5 rounded-xl transition-colors duration-200 uppercase text-xs tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  📄 Descargar Boleta (PDF)
                </button>

                <div className="text-center pt-1">
                  <button
                    onClick={() => alert("Solicitud de factura enviada al sistema.")}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline transition-colors"
                  >
                    Solicitar Canje por Factura con RUC
                  </button>
                </div>

                <button
                  onClick={() => {
                    setViewState('cart');
                    setPedidoActual(null);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors uppercase text-xs tracking-wider mt-4"
                >
                  ← Volver al carrito / Nuevo pedido
                </button>
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  );
}