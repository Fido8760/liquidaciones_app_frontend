import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export default function SinRendimientoBanner() {
    return (
        <div className=" p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl">
            <div className=" flex items-center gap-4">
                <div className=" bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full flex-shrink-0">
                    <ExclamationTriangleIcon className=" w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                    <h3 className=" text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-2">Aún no hay rendimiento Tabulado</h3>
                    <p className=" text-sm text-yellow-700 dark:text-yellow-500">No se puede calcular la comisión del operador ni la utilidad del viaje hasta que se establezca el rendimiento tabulado para esta unidad.</p>
                </div>
            </div>
        </div>
    )
}
