'use client';

import React, { useState, useEffect } from 'react';

interface CartItem {
    id: string;
    nombre: string;
    especificacion: string;
    precio: number;
    cantidad: number;
    imagen?: string;
}

interface Pedido {
    codigoUnico: string;
    articulos: CartItem[];
    montoTotal: number;
    fechaCreacion: string;
    estado: string;
}

export default function CarritoPage() {

    const [isMounted, setIsMounted] = useState(false);
    // Cargar el carrito al iniciar
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('carrito_compras');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [codigoSeguimiento, setCodigoSeguimiento] = useState<string | null>(null);
    const [pedidoActual, setPedidoActual] = useState<Pedido | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sincronizar con localStorage y notificar al header mediante 'cartUpdated'
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('carrito_compras', JSON.stringify(cartItems));
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }, [cartItems, isMounted]);

    if (!isMounted) {
        return null;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const envio = 0.00;
    const total = subtotal + envio;

    // Modificar la cantidad de un producto
    const cambiarCantidad = (id: string, delta: number) => {
        setCartItems((prevItems) => {
            return prevItems
                .map((item) => {
                    if (item.id === id) {
                        const nuevaCant = item.cantidad + delta;
                        return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[];
        });
    };

    // Eliminar un producto del carrito
    const eliminarProducto = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Finalizar la compra, generar código único y limpiar el carrito
    const handleFinalizarCompra = () => {
        const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
        const nuevoCodigo = `#ECO-${numeroAleatorio}`;
        setCodigoSeguimiento(nuevoCodigo);

        const pedidoNuevo = {
            codigoUnico: nuevoCodigo,
            articulos: cartItems,
            montoTotal: total,
            fechaCreacion: new Date().toISOString(),
            estado: "En Proceso"
        };

        setPedidoActual(pedidoNuevo);

        try {
            const pedidosGuardados = JSON.parse(localStorage.getItem('user_orders') || '[]');
            localStorage.setItem('user_orders', JSON.stringify([pedidoNuevo, ...pedidosGuardados]));

            localStorage.removeItem('carrito_compras');
            setCartItems([]);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            console.error("Error al guardar el pedido:", e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado dinámico de la página */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                            {codigoSeguimiento ? 'Seguimiento de Pedido' : 'Gestión de Carrito y Pedido'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {codigoSeguimiento
                                ? 'Monitorea el estado actual de tu orden generada.'
                                : 'Revisa tus ítems seleccionados antes de confirmar tu compra.'}
                        </p>
                    </div>
                    <a
                        href="/"
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors uppercase tracking-wider"
                    >
                        ← Seguir comprando
                    </a>
                </div>

                {/* VISTA CONDICIONAL: Si ya se generó el código, muestra el panel de seguimiento. Si no, muestra el carrito normal. */}
                {codigoSeguimiento && pedidoActual ? (
                    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-200/80">
                        {/* Banner de éxito */}
                        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-extrabold text-base text-emerald-800">¡Pedido procesado con éxito!</p>
                                <p className="text-xs text-emerald-700 mt-1">
                                    Código único de seguimiento (Clave primaria del pedido):{" "}
                                    <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded ml-1">
                                        {codigoSeguimiento}
                                    </span>
                                </p>
                            </div>
                            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                {pedidoActual.estado}
                            </span>
                        </div>

                        {/* Panel de Línea de Tiempo / Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">Fecha de Orden</p>
                                <p className="text-xs font-semibold text-slate-800 mt-1">
                                    {new Date(pedidoActual.fechaCreacion).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">Monto Total Pagado</p>
                                <p className="text-xs font-black text-blue-600 mt-1">
                                    S/ {pedidoActual.montoTotal.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-[11px] font-bold text-slate-400 uppercase">Método de Envío</p>
                                <p className="text-xs font-semibold text-emerald-600 mt-1">Express Prioritario (Gratis)</p>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
                            Línea de tiempo de entrega
                        </h3>

                        {/* Stepper visual moderno */}
                        <div className="relative pl-6 sm:pl-8 space-y-8 my-6 ml-2 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">

                            {/* Paso 1: Completado */}
                            <div className="relative flex items-start gap-4">
                                <span className="absolute -left-[31px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-white">
                                    ✓
                                </span>
                                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex-1 transition-all">
                                    <div className="flex justify-between items-center">
                                        <p className="font-extrabold text-sm text-emerald-900">Pedido Confirmado y Registrado</p>
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Completado</span>
                                    </div>
                                    <p className="text-xs text-emerald-700/80 mt-1">Validado en el sistema local y listo para procesamiento.</p>
                                </div>
                            </div>

                            {/* Paso 2: En Proceso / Activo */}
                            <div className="relative flex items-start gap-4">
                                <span className="absolute -left-[31px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-white animate-pulse">
                                    2
                                </span>
                                <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl flex-1 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <p className="font-extrabold text-sm text-blue-900">En Preparación y Empaquetado</p>
                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">En curso</span>
                                    </div>
                                    <p className="text-xs text-blue-700/80 mt-1">Los artículos del paquete están siendo reunidos en almacén.</p>
                                </div>
                            </div>

                            {/* Paso 3: Pendiente */}
                            <div className="relative flex items-start gap-4 opacity-60">
                                <span className="absolute -left-[31px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold ring-4 ring-white">
                                    3
                                </span>
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm text-slate-700">En Camino / Despacho</p>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Pendiente</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Entregado al operador logístico para su domicilio.</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <button
                                onClick={() => setCodigoSeguimiento(null)}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors uppercase tracking-wider"
                            >
                                ← Volver al carrito / Hacer otra compra
                            </button>
                        </div>
                    </div>
                ) : (
                    /* VISTA NORMAL: Grid principal del Carrito */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Columna Izquierda: Lista de Productos */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                    Artículos en el paquete
                                </h2>
                                <span className="text-xs font-semibold text-slate-400">
                                    {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                                </span>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-slate-400 font-medium">Tu carrito está vacío.</p>
                                    <a
                                        href="/"
                                        className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors uppercase tracking-wider"
                                    >
                                        Explorar catálogo
                                    </a>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                {item.imagen ? (
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">
                                                        ECO
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                                                        {item.nombre}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                        {item.especificacion}
                                                    </p>
                                                    <p className="text-xs font-semibold text-slate-600 mt-1">
                                                        Precio uni: S/ {item.precio.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Controles de Cantidad y Precio total */}
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                    <button
                                                        onClick={() => cambiarCantidad(item.id, -1)}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition text-xs cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                                                        {item.cantidad}
                                                    </span>
                                                    <button
                                                        onClick={() => cambiarCantidad(item.id, 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition text-xs cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right min-w-[90px]">
                                                    <span className="text-sm font-extrabold text-slate-900 block">
                                                        S/ {(item.precio * item.cantidad).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => eliminarProducto(item.id)}
                                                        className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition cursor-pointer mt-0.5"
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

                        {/* Columna Derecha: Resumen de la Orden */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80 h-fit">
                            <h2 className="text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 uppercase tracking-wider">
                                Resumen de la Orden
                            </h2>

                            <div className="space-y-3 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal de productos</span>
                                    <span className="font-bold text-slate-900">S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Envío Express Prioritario</span>
                                    <span className="font-bold text-emerald-600 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                                        Gratis
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-extrabold text-slate-900">
                                    <span>Total Pagado:</span>
                                    <span className="text-lg font-black text-blue-600">S/ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFinalizarCompra}
                                disabled={cartItems.length === 0}
                                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm ${cartItems.length === 0
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 hover:bg-purple-600 text-white cursor-pointer active:scale-[0.99]'
                                    }`}
                            >
                                Generar Código y Pagar
                            </button>

                            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                                <p>✔ Transacción segura con cifrado local.</p>
                                <p>✔ Garantía oficial de 2 años incluida.</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}