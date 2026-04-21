import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, MinusIcon } from "@heroicons/react/20/solid";
import type { LiquidacionOperador } from "../../types"
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

type OperadorHistorialProps = {
    liquidaciones: LiquidacionOperador[]
}

export default function OperadorHistorial({liquidaciones}: OperadorHistorialProps) {
    return (
        <div className=" bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mt-8">
            <div className=" px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className=" text-sm font-bold text-gray-800 dark:text-slate-200">
                    Historial Detallado de Viajes
                </h3>
            </div>
            <div className=" overflow-x-auto">
                <table className=" w-full text-sm">
                    <thead>
                        <tr className=" border-b border-gray-100 dark:border-gray-700  bg-gray-700 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Folio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Unidad</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Km</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Rendimiento</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase">Pago</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {liquidaciones.map(liquidacion => {
                            const dif = liquidacion.rendimiento_real - liquidacion.rendimiento_tabulado;
                            const tendencia = dif > 0.01 ? 'favor' : dif < -0.01 ? 'contra' : 'neutro';

                            return (
                                <tr 
                                    key={liquidacion.id}
                                    className=" hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <td className=" px-4 py-3 font-bold text-purple-600 dark:text-purple-400">
                                        {liquidacion.folio_liquidacion}
                                    </td>
                                    <td className=" px-4 py-3 text-gray-600 dark:text-gray-400">
                                        {formatDate(liquidacion.fecha_inicio)}
                                    </td>
                                    <td className=" px-4 py-4">
                                        <div className=" font-medium text-gray-900 dark:text-white">{liquidacion.no_unidad}</div>
                                        <div className=" text-[10px] text-gray-400">{liquidacion.tipo_unidad}</div>
                                    </td>
                                    <td className=" px-4 py-3 text-right dark:text-gray-100">
                                        {Number(liquidacion.kilometros_recorridos).toLocaleString()} km
                                    </td>
                                    <td className=" px-4 py-3 text-right">
                                        <div className=" flex flex-col items-end">
                                            <div className={`flex items-center gap-1 font-bold ${
                                                tendencia === 'favor' ? 'text-green-600' : 
                                                tendencia === 'contra' ? 'text-red-600' : 'text-gray-600'
                                            }`}>                                                 {liquidacion.rendimiento_real.toFixed(2)}
                                                {tendencia === 'favor' ? <ArrowTrendingUpIcon className="w-3 h-3"/> : 
                                                 tendencia === 'contra' ? <ArrowTrendingDownIcon className="w-3 h-3"/> : 
                                                 <MinusIcon className="w-3 h-3"/>}
                                            </div>
                                            <div className="text-[10px] text-gray-400">Meta: {liquidacion.rendimiento_tabulado}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-slate-200">
                                        {formatCurrency(liquidacion.monto_pagado || 0)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
