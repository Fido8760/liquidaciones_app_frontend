import { MapIcon, MapPinIcon } from "@heroicons/react/20/solid"
import type { Liquidacion } from "../../../../types"
import { formatCurrency } from "../../../../utils/formatCurrency"

type DetalleFletesProps = {
    liquidacion: Liquidacion
}

export default function DetalleFletes({ liquidacion }: DetalleFletesProps) {
    return (
        <section>
            <h2 className=" text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                <MapIcon className=" w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Detalle de Fletes / Viajes Realizados
            </h2>

            <div className=" space-y-3">
                {liquidacion.costos_fletes && liquidacion.costos_fletes.length > 0 ? (
                    <>
                        {liquidacion.costos_fletes.map((flete, index) => (
                            <div key={flete.id} className=" p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className=" flex justify-between items-start">
                                    <div className=" flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className=" flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                                {index +1}
                                            </span>
                                        </p>
                                        {(flete.origen || flete.destino ) && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                                                <MapPinIcon className=" w-4 h-4 text-indigo-500"/>
                                                <span className=" font-medium">{flete.origen || 'N/A'}</span>
                                                <svg className=" w-4 h-4" fill="none" stroke="currentColor"  viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                                <span className=" font-medium">{flete.destino || 'N/A'}</span>
                                            </p>
                                        )}
                                        {flete.descripcion && (
                                            <p className=" text-xs text-gray-500 dark:text-gray-400 mt-1">{flete.descripcion}</p>
                                        )}
                                    </div>
                                    <div className=" text-right ml-4">
                                        <p className=" text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(flete.monto)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className=" pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                            <div className=" flex justify-between items-center">
                                <p className=" font-bold text-gray-900 dark:text-white" >Total Fletes:</p>
                                <p className=" text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(liquidacion.total_costo_fletes)}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className=" p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <MapPinIcon className=" w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className=" text-gray-500 dark:text-gray-400">No hay feltes registrados</p>
                    </div>
                )}
            </div>
        </section>
    )
}
