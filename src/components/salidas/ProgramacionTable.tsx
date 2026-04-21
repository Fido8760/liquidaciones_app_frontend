import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { ProgramacionSalida } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { formatDateOnly } from "../../utils/formatDate";

type ProgramacionTableProps = {
    salidas: ProgramacionSalida[];
    onEditar?: (id: number) => void;
    modoHistorico?: boolean;
    onAsignar?: (id: number) => void;
    onCancelar?: (id: number) => void;
    onEliminar?: (id: number) => void;
    onCambiarEstatus?: (id: number) => void;
    esDiaActual?: boolean;
};

const estatusStyles: Record<string, string> = {
    SIN_ASIGNAR: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    ASIGNADO: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    SALIO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const estatusLabel: Record<string, string> = {
    SIN_ASIGNAR: "Sin Asignar Unidad",
    ASIGNADO: "Asignado",
    SALIO: "En Ruta",
    CANCELADO: "Cancelado",
};

export default function ProgramacionTable({ salidas, onEditar, modoHistorico, onAsignar, onCancelar, onEliminar, onCambiarEstatus, esDiaActual }: ProgramacionTableProps) {
    const { data: user } = useAuth();
    const [filaExpandida, setFilaExpandida] = useState<number | null>(null);

    const toggleFila = (id: number) => {
        setFilaExpandida(prev => prev === id ? null : id);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 w-8" /> {/* columna chevron */}
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Unidad</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo Solicitado</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente / Destino</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Carga</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Descarga</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Estatus
                                <span className="block text-[9px] lowercase font-normal italic">(Click para dar salida)</span>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuarios</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {salidas.map(salida => (
                            <React.Fragment key={salida.id}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    
                                    {/* Chevron */}
                                    <td className="px-3 py-4">
                                        <button
                                            onClick={() => toggleFila(salida.id)}
                                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                                        >
                                            {filaExpandida === salida.id
                                                ? <ChevronUpIcon className="w-4 h-4" />
                                                : <ChevronDownIcon className="w-4 h-4" />
                                            }
                                        </button>
                                    </td>

                                    <td className="px-6 py-4">
                                        {salida.unidad ? (
                                            <>
                                                <p className="font-medium text-gray-900 dark:text-white">{salida.unidad.no_unidad}</p>
                                                <p className="text-xs text-gray-500">{salida.unidad.u_placas}</p>
                                            </>
                                        ) : (
                                            (modoHistorico && user?.rol !== 'SISTEMAS') ? (
                                                <span className="text-sm font-semibold text-red-500 italic">Sin asignar</span>
                                            ) : (
                                                <button
                                                    onClick={() => onAsignar?.(salida.id)}
                                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                >
                                                    Asignar Unidad
                                                </button>
                                            )
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                            {salida.tipo_unidad_solicitado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{salida.cliente}</p>
                                        <p className="text-xs text-gray-500">{salida.destino}</p>
                                        {salida.motivo_cancelacion && (
                                            <p className="text-xs text-red-500 mt-1">Motivo: {salida.motivo_cancelacion}</p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        <p>{formatDateOnly(salida.fecha_carga)}</p>
                                        <p className="text-xs text-gray-500">{salida.hora_carga}</p>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        <p>{formatDateOnly(salida.fecha_descarga)}</p>
                                        <p className="text-xs text-gray-500">{salida.hora_descarga}</p>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => {
                                                if (salida.estatus === 'ASIGNADO' && esDiaActual) onCambiarEstatus?.(salida.id);
                                            }}
                                            disabled={salida.estatus !== 'ASIGNADO' || !esDiaActual}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-opacity
                                                ${estatusStyles[salida.estatus]}
                                                ${salida.estatus !== 'CANCELADO' && (!modoHistorico || user?.rol === 'SISTEMAS') && esDiaActual
                                                    ? 'hover:opacity-75 cursor-pointer'
                                                    : 'cursor-not-allowed opacity-70'
                                                }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${
                                                salida.estatus === 'ASIGNADO' ? 'bg-amber-500' :
                                                salida.estatus === 'SALIO' ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            {estatusLabel[salida.estatus]}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Creado:</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{salida.creadoPor.nombre} {salida.creadoPor.apellido}</p>
                                        </div>
                                        {salida.modificadoPor && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <p className="text-xs text-amber-500 uppercase font-bold">Modificado:</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{salida.modificadoPor.nombre} {salida.modificadoPor.apellido}</p>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            {(!modoHistorico || user?.rol === 'SISTEMAS') && (
                                                <>
                                                    <button
                                                        onClick={() => onEditar?.(salida.id)}
                                                        disabled={salida.estatus === 'CANCELADO'}
                                                        className="text-blue-600 hover:text-blue-900 disabled:opacity-40"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => onCancelar?.(salida.id)}
                                                        disabled={salida.estatus === 'CANCELADO'}
                                                        className="text-amber-600 hover:text-amber-900 disabled:opacity-40"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                            {user?.rol === 'SISTEMAS' && (
                                                <button
                                                    onClick={() => onEliminar?.(salida.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                            {modoHistorico && user?.rol !== 'SISTEMAS' && (
                                                <span className="text-xs text-gray-400 italic">Solo lectura</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>

                                {/* Fila expandible */}
                                {filaExpandida === salida.id && (
                                    <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                                        <td colSpan={9} className="px-6 py-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-xs font-semibold uppercase text-gray-400 mt-0.5 shrink-0">
                                                    Observaciones:
                                                </span>
                                                {salida.observaciones
                                                    ? <p className="text-sm text-gray-700 dark:text-gray-300">{salida.observaciones}</p>
                                                    : <p className="text-sm text-gray-400 italic">Sin observaciones</p>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}