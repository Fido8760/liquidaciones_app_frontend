import { useAuth } from "../../hooks/useAuth";
import type { ProgramacionSalida } from "../../types";

type ProgramacionCardsProps = {
    salidas: ProgramacionSalida[];
    onEditar?: (id: number) => void;
    onAsignar?: (id: number) => void;
    onEliminar?: (id: number) => void;
    onCancelar?: (id: number) => void;
    modoHistorico?: boolean;
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
    SIN_ASIGNAR: "Sin asignar",
    ASIGNADO: "Asignado",
    SALIO: "En Ruta",
    CANCELADO: "Cancelado",
};

export default function ProgramacionCards({ salidas, onEditar, onAsignar, onEliminar, onCancelar, modoHistorico, onCambiarEstatus, esDiaActual }: ProgramacionCardsProps) {
    const { data: user } = useAuth();

    return (
        <div className="space-y-4">
            {salidas.map(salida => {
                return (
                    <div key={salida.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4">
                        
                        {/* HEADER: UNIDAD Y STATUS */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                {salida.unidad ? (
                                    <>
                                        <p className="font-semibold text-gray-900 dark:text-white">Unidad {salida.unidad.no_unidad}</p>
                                        <p className="text-xs text-gray-500">{salida.unidad.u_placas}</p>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onAsignar?.(salida.id)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-full transition-colors shadow-sm uppercase"
                                    >
                                        Asignar Unidad
                                    </button>
                                )}
                                <p className="text-[10px] mt-1 font-bold text-blue-500 uppercase">
                                    Solicitado: {salida.tipo_unidad_solicitado}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <button
                                    onClick={() => {
                                        if (salida.estatus === 'ASIGNADO') onCambiarEstatus?.(salida.id);
                                    }}
                                    disabled={salida.estatus !== 'ASIGNADO' || !esDiaActual}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all
                                        ${estatusStyles[salida.estatus]}
                                        ${salida.estatus === 'ASIGNADO' ? 'active:scale-95 shadow-md ring-1 ring-amber-400' : 'opacity-80'}
                                    `}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                        salida.estatus === "ASIGNADO" ? "bg-amber-500" : 
                                        salida.estatus === "SALIO" ? "bg-green-500" : "bg-red-500"
                                    }`} />
                                    {estatusLabel[salida.estatus]}
                                </button>
                                
                                {/* Leyenda condicional */}
                                {salida.estatus === 'ASIGNADO' && (
                                    <span className="text-[9px] text-amber-600 font-medium animate-pulse">
                                        Presiona para dar salida
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* INFO CLIENTE */}
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{salida.cliente}</p>
                            <p className="text-xs text-gray-500">{salida.destino}</p>
                        </div>

                        {/* GRID TIEMPOS */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <p className="text-[10px] uppercase text-gray-400 font-bold">Carga</p>
                                <p className="font-medium dark:text-white text-xs">{salida.fecha_carga}</p>
                                <p className="text-[10px] text-gray-500">{salida.hora_carga}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <p className="text-[10px] uppercase text-gray-400 font-bold">Descarga</p>
                                <p className="font-medium dark:text-white text-xs">{salida.fecha_descarga}</p>
                                <p className="text-[10px] text-gray-500">{salida.hora_descarga}</p>
                            </div>
                        </div>

                        {/* FOOTER: USUARIOS Y ACCIONES */}
                        <div className="flex justify-between items-end pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-[11px]">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Creado por</p>
                                <p className="text-gray-700 dark:text-gray-300">{salida.creadoPor.nombre} {salida.creadoPor.apellido}</p>
                                {salida.modificadoPor && (
                                    <div className="mt-1 text-amber-600">
                                        <p className="font-bold uppercase text-[9px]">Modificado por</p>
                                        <p>{salida.modificadoPor.nombre} {salida.modificadoPor.apellido}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3 text-sm font-medium">
                                {/* Editar y Cancelar: Solo si NO es histórico O si es SISTEMAS */}
                                {(!modoHistorico || user?.rol === 'SISTEMAS') && (
                                    <>
                                        <button 
                                            onClick={() => onEditar?.(salida.id)}
                                            disabled={salida.estatus === 'CANCELADO'}
                                            className="text-blue-600 disabled:opacity-30"
                                        >Editar</button>
                                        <button 
                                            onClick={() => onCancelar?.(salida.id)}
                                            disabled={salida.estatus === 'CANCELADO'}
                                            className="text-amber-600 disabled:opacity-30"
                                        >Cancelar</button>
                                    </>
                                )}

                                {/* Eliminar: Solo SISTEMAS */}
                                {user?.rol === 'SISTEMAS' && (
                                    <button onClick={() => onEliminar?.(salida.id)} className="text-red-600">
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}