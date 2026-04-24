import {
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    MinusIcon,
} from "@heroicons/react/20/solid";
import type { KpiTipoUnidad } from "../../types";

type Props = {
    tiposUnidad: KpiTipoUnidad[];
};

export default function OperadorTiposUnidad({ tiposUnidad }: Props) {
    if (!tiposUnidad.length) return null;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    Rendimiento por tipo de unidad
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    El tabulado se interpreta correctamente solo dentro del contexto de cada tipo de unidad
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {tiposUnidad.map((tipo) => {
                    const tendencia =
                        tipo.diferencia_promedio > 0.01
                            ? "favor"
                            : tipo.diferencia_promedio < -0.01
                              ? "contra"
                              : "neutro";

                    return (
                        <div
                            key={tipo.tipo_unidad}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        {tipo.tipo_unidad}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        {tipo.total_viajes} {tipo.total_viajes === 1 ? "viaje" : "viajes"}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700">
                                    {tendencia === "favor" ? (
                                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : tendencia === "contra" ? (
                                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {tipo.rendimiento_real_promedio.toFixed(2)}
                                    <span className="text-sm font-normal ml-1">km/l</span>
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Tabulado: {tipo.rendimiento_tabulado_promedio.toFixed(2)} km/l
                                </p>
                                <p
                                    className={`mt-1 text-xs ${
                                        tendencia === "favor"
                                            ? "text-green-600 dark:text-green-400"
                                            : tendencia === "contra"
                                              ? "text-red-600 dark:text-red-400"
                                              : "text-gray-500 dark:text-gray-400"
                                    }`}
                                >
                                    {tipo.diferencia_promedio > 0 ? "+" : ""}
                                    {tipo.diferencia_promedio.toFixed(2)} km/l vs tabulado
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
