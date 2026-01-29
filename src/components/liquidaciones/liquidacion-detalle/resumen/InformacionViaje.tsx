import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BuildingOfficeIcon, CalendarIcon, ClockIcon, MapPinIcon, TruckIcon, UserIcon } from "@heroicons/react/20/solid"
import type { Liquidacion } from "../../../../types"
import { calcularDiasViaje } from "../../../../utils/calcularDiasViaje"
import InfoItem from "../InfoItem"
import { formatDateTime } from "../../../../utils/formatDate"
import { formatCurrency } from "../../../../utils/formatCurrency"

type InformacionViajeProps = {
    liquidacion: Liquidacion
    canViewFinancials: boolean
}

export default function InformacionViaje({ liquidacion, canViewFinancials }: InformacionViajeProps) {
    
    const diasViaje = calcularDiasViaje(liquidacion.fecha_inicio, liquidacion.fecha_fin)
    const hasRendimientoTabulado = liquidacion.rendimiento_tabulado > 0;

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                Detalle de Fletes / Viajes Realizados
            </h2>
            <div className=" p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <InfoItem 
                        label="Unidad / Placas / Tipo"
                        value={`${liquidacion.unidad.no_unidad} / ${liquidacion.unidad.u_placas} / ${liquidacion.unidad.tipo_unidad}`}
                        icon={<TruckIcon className=" w-5 h-5 text-gray-500" />}
                    />

                    <InfoItem 
                        label="Operador" 
                        value={`${liquidacion.operador.nombre} ${liquidacion.operador.apellido_p} ${liquidacion.operador.apellido_m}`}
                        icon={<UserIcon className="w-5 h-5 text-gray-500" />}
                    />
                    <InfoItem 
                        label="Cliente" 
                        value={`${liquidacion.cliente}`} 
                        icon={<BuildingOfficeIcon className="w-5 h-5 text-gray-500" />}
                    />
                    
                    <InfoItem 
                        label="Fecha Inicio" 
                        value={formatDateTime(liquidacion.fecha_inicio)}
                        icon={<CalendarIcon className="w-5 h-5 text-gray-500" />}
                    />
                    <InfoItem 
                        label="Fecha Llegada" 
                        value={formatDateTime(liquidacion.fecha_llegada)} 
                        icon={<CalendarIcon className="w-5 h-5 text-gray-500" />} 
                    />
                    <InfoItem 
                        label="Fecha Fin" 
                        value={formatDateTime(liquidacion.fecha_fin)}
                        icon={<CalendarIcon className="w-5 h-5 text-gray-500" />} 
                    />
                    
                    <InfoItem 
                        label="Duración del Viaje" 
                        value={`${diasViaje} día${diasViaje !== 1 ? 's' : ''}`} 
                        icon={<ClockIcon className="w-5 h-5 text-purple-500" />}
                        highlight 
                        className="text-purple-600 dark:text-purple-400"
                    />
                    
                    <InfoItem 
                        label="Kilómetros Recorridos" 
                        value={`${liquidacion.kilometros_recorridos.toLocaleString('es-MX')} km`} 
                        highlight 
                    />
                    
                    <InfoItem 
                        label="Rendimiento Real" 
                        value={`${liquidacion.rendimiento_real} km/l`} 
                        highlight 
                    />
                    
                    {hasRendimientoTabulado && (
                        <InfoItem 
                            label="Rendimiento Tabulado" 
                            value={`${liquidacion.rendimiento_tabulado.toFixed(2)} km/l`} 
                            highlight 
                            className="text-green-600 dark:text-green-400"
                        />
                    )}

                    {(liquidacion.diesel_a_favor_sin_iva > 0 || liquidacion.diesel_en_contra_sin_iva > 0 ) && canViewFinancials && hasRendimientoTabulado && (
                        <div className=" md:col-span-3">
                            <div className={` p-4 rounded-lg border-2 ${liquidacion.diesel_a_favor_sin_iva > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
                                <div className=" flex items-center gap-3">
                                    {liquidacion .diesel_a_favor_sin_iva > 0 ? (
                                        <>
                                            <ArrowTrendingUpIcon className=" w-8 h-8 text-green-600 dark:text-green-400" />
                                            <div>
                                                <p className=" font-semibold text-green-900 dark:text-green-300">Rendimiento a Favor</p>
                                                <p className=" text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(liquidacion.diesel_a_favor_sin_iva)}</p>
                                                <p className=" text-xs text-green-600 dark:text-green-500 mt-1">El operador ahorró combustible</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowTrendingDownIcon className=" w-8 h-8 text-red-600 dark:text-red-400"/>
                                            <div>
                                                <p className=" font-semibold text-red-900 dark:text-red-300">Rendimiento en Contra</p>
                                                <p className=" text-2xl font-bold text-red-700 dark:text-red-400">{formatCurrency(liquidacion.diesel_en_contra_sin_iva)}</p>
                                                <p className=" text-xs text-red-600 dark:text-red-500 mt-1">El operador excedió el consumo esperado</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </dl>
            </div>
        </section>
    )
}
