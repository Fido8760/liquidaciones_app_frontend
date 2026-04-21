import { useQuery } from "@tanstack/react-query"
import type { Operador } from "../../types"
import { getKpisOperador, getLiquidacionesOperador } from "../../api/liquidaciones/LiquidacionAPI"
import LoadingSpinner from "../ui/LoadingSpinner"
import ErrorQuery from "../ui/ErrorQuery"
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BanknotesIcon, MapIcon, MinusIcon, TruckIcon } from "@heroicons/react/20/solid"
import { formatCurrency } from "../../utils/formatCurrency"
import OperadorUnidades from "./OperadorUnidades"
import OperadorHistorial from "./OperadorHistorial"

type OperadorKpisProps ={
    operadorId: number
    operador: Operador
    fechaInicio: string
    fechaFin: string
}
export default function OperadorKpis({ operadorId, operador, fechaInicio, fechaFin }: OperadorKpisProps) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['kpis-operador', operadorId, fechaInicio, fechaFin],
        queryFn: () => getKpisOperador(operadorId, { fechaInicio: fechaInicio || undefined, fechaFin: fechaFin || undefined }),
        enabled: !!operadorId
    })

    const { data: historialData} = useQuery({
        queryKey: ['historial-operador', operadorId, fechaInicio, fechaFin],
        queryFn: () => getLiquidacionesOperador(operadorId, { fechaInicio: fechaInicio || undefined, fechaFin: fechaFin || undefined }),
        enabled: !!operadorId
    })

    if(isLoading) return <LoadingSpinner mensaje="Cargando KPIs..." />
    if(isError) return <ErrorQuery mensaje="Error al cargar los KPIs del operador." />

    if(data) {
        const nombreOperador = `${operador.nombre} ${operador.apellido_p} ${operador.apellido_m}`
        const tendencia = data.diferencia_promedio > 0.1 ? 'favor' : data.diferencia_promedio < -0.1 ? 'contra' : 'neutro'
        return (
            <div className=" space-y-6">
                <div className=" flex items-center gap-3">
                    <div className=" w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <span className=" text-purple-600 dark:text-purple-400 font-bold text-sm">
                            {operador.apellido_p.charAt(0)}{operador.apellido_m.charAt(0)}{operador.nombre.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h2 className=" text-lg font-bold text-gray-900 dark:text-white">
                            {nombreOperador}
                        </h2>
                        <p className=" text-xs text-gray-500 dark:text-gray-400">
                            {data.total_viajes === 0 ? 'Sin viajes pagados en el periodo' : `${data.total_viajes} ${data.total_viajes === 1 ? 'viaje pagado' : 'viajes pagados'}`}
                            {(fechaInicio || fechaFin) && (
                                <span className=" ml-1">
                                    · {fechaInicio && `desde ${fechaInicio}`} {fechaFin && `hasta ${fechaFin}`}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className=" flex items-center justify-between mb-3">
                            <p className=" text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Viajes Realizados
                            </p>

                            <div className=" p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <TruckIcon className=" w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className=" text-3xl font-bold text-gray-900 dark:text-white" >
                            {data.total_viajes}
                        </p>
                    </div>

                    <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className=" flex items-center justify-between mb-3">
                            <p className=" text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Kilómetros totales
                            </p>

                            <div className=" p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <MapIcon className=" w-4 h-4 text-blue-600 dark:text-blue-400"/>
                            </div>
                        </div>
                        <p className=" text-3xl font-bold text-gray-900 dark:text-white">
                            {Number(data.kilometros_totales).toLocaleString('es-MX')}
                        </p>
                        <p className=" text-xs text-gray-400 dark:text-gray-500 mt-1">km recorridos</p>
                    </div>

                    <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className=" flex items-center justify-between mb-3">
                            <p className=" text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Comisión total pagada
                            </p>
                            <div className=" p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <BanknotesIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className=" text-3xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(data.monto_pagado_total)}
                        </p>
                    </div>

                    <div className={`rounded-xl p-4 border ${ tendencia === 'favor' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : tendencia === 'contra' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                        : ' bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                        <div className=" flex items-center justify-between mb-3">
                            <p className={` text-xs font-medium uppercase tracking-wide ${
                                tendencia === 'favor'
                                    ? 'text-green-600 dark:text-green-400'
                                    : tendencia === 'contra'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                Rendimiento promedio
                            </p>
                            <div className={` p-2 rounded-lg ${
                                tendencia === 'favor'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : tendencia === 'contra'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                                {tendencia === 'favor' 
                                    ? <ArrowTrendingUpIcon className=" w-4 h-4 text-green-600 dark:text-green-400"/> 
                                    : tendencia === 'contra' 
                                    ? <ArrowTrendingDownIcon className=" w-4 h-4 text-red-600 dark:text-red-400"/> 
                                    : <MinusIcon className=" w-4 h-4 text-gray-500"/>
                                }
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${
                            tendencia === 'favor'
                                ? 'text-green-700 dark:text-green-300'
                                : tendencia === 'contra'
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-gray-900 dark:text-white'
                        }`}>
                            {Number(data.rendimiento_real_promedio).toFixed(2)}
                            <span className="text-base font-normal ml-1">
                                km/l
                            </span>
                        </p>
                        <p className={`text-xs mt-1 ${
                            tendencia === 'favor'
                                ? 'text-green-600 dark:text-green-400'
                                : tendencia === 'contra'
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-400 dark:text-gray-500'
                        }`}>
                            Tabulado: {Number(data.rendimiento_tabulado_promedio).toFixed(2)} km/l
                            {' · '}
                            {tendencia === 'favor' ? '+' : ''}{Number(data.diferencia_promedio).toFixed(2)} diferencia
                        </p>
                    </div>
                </div>
                <OperadorUnidades unidades={data.unidades} />
                {historialData && <OperadorHistorial liquidaciones={historialData} /> }
            </div>
        )
    }
}
