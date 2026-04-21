import type { KpiUnidad } from '../../types'
import { TruckIcon } from '@heroicons/react/24/outline'

interface Props {
    unidades: KpiUnidad[]
}

export default function OperadorUnidades({ unidades }: Props) {

    if (!unidades.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                <TruckIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay unidades registradas en el período
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    Unidades operadas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Historial por unidad asignada
                </p>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Unidad
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Tipo
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Placas
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Viajes
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Rend. promedio
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {unidades.map(unidad => {
                            const real = unidad.rendimiento_promedio;
                            const tabulado = unidad.rendimiento_tabulado_promedio;
                            const diferencia = real - tabulado;

                            const tendencia = diferencia > 0.01 ? 'favor' : diferencia < -0.01 ? 'contra' : 'neutro';
 
                            return (
                                <tr
                                    key={unidad.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    {/* Unidad */}
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {unidad.no_unidad}
                                        </span>
                                    </td>

                                    {/* Tipo */}
                                    <td className="px-4 py-3">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                            {unidad.tipo_unidad}
                                        </span>
                                    </td>

                                    {/* Placas */}
                                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                                        {unidad.u_placas}
                                    </td>

                                    {/* Viajes */}
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {Number(unidad.total_viajes)}
                                        </span>
                                    </td>

                                    {/* Rendimiento */}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className={`font-bold ${
                                                tendencia === 'favor' 
                                                ? 'text-green-600 dark:text-green-400'
                                                : tendencia === 'contra'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                                {real.toFixed(2)} km/l
                                            </span>

                                            <span className="text-[10px] text-gray-400">
                                                Meta: {tabulado.toFixed(2)} ({diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)} km/l)
                                            </span>
                                        </div>
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
