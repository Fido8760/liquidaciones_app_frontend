import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { updateStatus } from "../../../api/LiquidacionAPI";
import { useAuth } from "../../../hooks/useAuth";
import { EstadoLiquidacion, type Liquidacion } from "../../../types";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ArrowLeftIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import ModalAjustarLiquidacion from "./resumen/ModalAjustarLiquidacion";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";

const FORMATO_ESTADOS: Record<string, string> = { 
    BORRADOR: 'Borrador', 
    EN_REVISION: 'En Revisión', 
    APROBADA: 'Aprobada', 
    PAGADA: 'Pagada', 
    CANCELADA: 'Cancelada' 
};

const COLORES_ESTADOS: Record<string, string> = {
    BORRADOR: 'bg-slate-200 text-slate-800 border-slate-300',
    EN_REVISION: 'bg-amber-100 text-amber-800 border-amber-300',
    APROBADA: 'bg-blue-100 text-blue-800 border-blue-300',
    PAGADA: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300',
};

type DetalleHeaderProps = {
    liquidacion: Liquidacion;
}

export default function DetalleHeader({ liquidacion }: DetalleHeaderProps) {
    
    const { data: user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showAjustarModal, setShowAjustarModal] = useState(false);

    const isCapturista = user?.rol === 'CAPTURISTA';
    const isDirector = user?.rol === 'DIRECTOR' || user?.rol === 'ADMIN';
    const isSistemas = user?.rol === 'SISTEMAS';

    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacion.id] });
            navigate('/')
        }
    });

    const handleEstadoClick = (nuevoEstado: EstadoLiquidacion) => {
        let title = '¿Cambiar estado?';
        let confirmText = 'Sí, cambiar';
        let confirmColor = '#3085d6';

        if (nuevoEstado === EstadoLiquidacion.APROBADA) {
            title = '¿Finalizar y Aprobar?';
            confirmText = 'Sí, Finalizar';
            confirmColor = '#9333ea';
        } else if (nuevoEstado === EstadoLiquidacion.PAGADA) {
            title = '¿Autorizar Pago?';
            confirmText = 'Sí, Pagar';
            confirmColor = '#10b981';
        } else if (nuevoEstado === EstadoLiquidacion.EN_REVISION && liquidacion.estado === EstadoLiquidacion.APROBADA) {
            title = '¿Rechazar Liquidación?';
            confirmText = 'Sí, Rechazar';
            confirmColor = '#ef4444';
        } else if (nuevoEstado === EstadoLiquidacion.EN_REVISION && liquidacion.estado === EstadoLiquidacion.PAGADA) {
            title = '¿Reabrir Liquidación Pagada?';
            confirmText = 'Sí, Reabrir';
            confirmColor = '#f59e0b';
        }

         if (nuevoEstado === EstadoLiquidacion.CANCELADA) {
             Swal.fire({
                title: '¿Cancelar Definitivamente?',
                text: "Esta acción anulará el folio. No se puede deshacer.",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#374151',
                confirmButtonText: 'Sí, Cancelar',
                cancelButtonText: 'Volver'
            }).then((result) => {
                if (result.isConfirmed) mutate({ liquidacionId: liquidacion.id, status: nuevoEstado });
            });
            return;
        }

        Swal.fire({
            title,
            text: "Esta acción quedará registrada.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: '#6B7280',
            confirmButtonText: confirmText
        }).then((result) => {
            if (result.isConfirmed) {
                mutate({ liquidacionId: liquidacion.id, status: nuevoEstado });
            }
        });
    }

    const puedeCancelar = isSistemas && liquidacion.estado !== EstadoLiquidacion.PAGADA
    const puedeAjustar = (isDirector || isSistemas) && liquidacion.estado === EstadoLiquidacion.APROBADA;
    const pudeFinalizar = ( isCapturista || isSistemas) && liquidacion.estado === EstadoLiquidacion.EN_REVISION;


    return (
        <>
            <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="p-4 md:p-6">

                    {/* Header en 2 columnas */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        {/* INFO IZQUIERDA */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    Liquidación{' '}
                                    <span className="text-fuchsia-600">
                                        #{liquidacion.folio_liquidacion}
                                    </span>
                                </h1>

                                <span
                                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border whitespace-nowrap
                                    ${COLORES_ESTADOS[liquidacion.estado] ?? 'bg-gray-200'}`}
                                >
                                    {FORMATO_ESTADOS[liquidacion.estado] ?? liquidacion.estado}
                                </span>
                            </div>

                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
                                {liquidacion.cliente}
                            </p>

                            {liquidacion.estado === EstadoLiquidacion.PAGADA && liquidacion.fecha_pago && (
                                <p className="text-xs text-emerald-600 mt-1 font-semibold">
                                    Pagada el{' '}
                                    {new Date(liquidacion.fecha_pago).toLocaleDateString('es-MX')}
                                </p>
                            )}
                        </div>

                        {/* ACCIONES DERECHA */}
                        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
                            
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                                        text-gray-600 hover:text-gray-900 hover:bg-gray-100
                                        dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700
                                        transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Volver</span>
                            </Link>

                            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                            
                            <div className=" flex gap-2">
                                {pudeFinalizar && (
                                    <button
                                        onClick={() => handleEstadoClick(EstadoLiquidacion.APROBADA)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                                                bg-indigo-50 text-indigo-700 hover:bg-indigo-100
                                                dark:bg-purple-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30
                                                border border-indigo-200 dark:border-indigo-800
                                                transition-colors"
                                    >
                                        Finalizar
                                    </button>
                                )}

                            </div>

                            <div className=" flex gap-2">
                                {puedeAjustar && (
                                    <button
                                        onClick={() => setShowAjustarModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                                                bg-purple-50 text-purple-700 hover:bg-purple-100
                                                dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30
                                                border border-purple-200 dark:border-purple-800
                                                transition-colors"
                                    >
                                        <span className="hidden sm:inline">Rendimiento Tabulado</span>
                                        <span className="sm:hidden">Rendimiento</span>
                                    </button>
                                )}

                                {(isDirector || isSistemas) && liquidacion.estado === EstadoLiquidacion.APROBADA && (
                                    <button
                                        onClick={() => handleEstadoClick(EstadoLiquidacion.EN_REVISION)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                                                text-red-700 hover:bg-red-50
                                                dark:text-red-400 dark:hover:bg-red-900/20
                                                border border-red-200 dark:border-red-800
                                                transition-colors"
                                    >
                                        <span className="hidden sm:inline">Rechazar</span>
                                        <span className="sm:hidden">✕</span>
                                    </button>
                                )}
                            </div>

                             {isDirector && liquidacion.estado === EstadoLiquidacion.APROBADA && (
                                <button
                                    onClick={() => handleEstadoClick(EstadoLiquidacion.PAGADA)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg
                                            bg-gradient-to-r from-emerald-600 to-emerald-500 
                                            text-white hover:from-emerald-700 hover:to-emerald-600
                                            transform hover:scale-105
                                            transition-all duration-200
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="hidden sm:inline">Autorizar Pago</span>
                                        <span className=" text-xs font-bold">Pagar: {formatCurrency(liquidacion.total_neto_pagar)}</span>
                                    </div>
                                </button>
                            )}
                                                    {puedeCancelar && (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <EllipsisVerticalIcon className="h-5 w-5" />
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-700">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            handleEstadoClick(EstadoLiquidacion.CANCELADA)
                                                        }
                                                        className={`${
                                                            active
                                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        } flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                                    >
                                                        <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
                                                        Cancelar Liquidación
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            {/* Modal de Ajustes */}
            {showAjustarModal && (
                <ModalAjustarLiquidacion 
                    liquidacion={liquidacion}
                    onClose={() => setShowAjustarModal(false)}
                />
            )}
        </>
    )
}