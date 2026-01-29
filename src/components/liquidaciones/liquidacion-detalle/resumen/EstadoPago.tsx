import { CheckCircleIcon } from "@heroicons/react/20/solid"
import { EstadoLiquidacion, type Liquidacion } from "../../../../types"
import { formatDate } from "../../../../utils/formatDate"

type EstadoPagoProps = {
    liquidacion: Liquidacion
}

export default function EstadoPago({liquidacion}: EstadoPagoProps) {
    if (liquidacion.estado !== EstadoLiquidacion.PAGADA) {
        return null
    }
    return (
        <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border-2  border-emerald-300 dark:border-emerald-700 rounded-xl flex items-center gap-4">
            <div className=" bg-emerald-100 dark:bg-emerald-800 p-3 rounded-full">
                <CheckCircleIcon className=" w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
                <h3 className=" text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircleIcon className=" w-5 h-5" /> 
                    Liquidación Pagada
                </h3>
                <p className=" text-sm text-emerald-700 dark:text-emerald-500">
                    Pagada por: <b>{liquidacion.usuario_pagador?.nombre} {liquidacion.usuario_pagador?.apellido}</b>
                    <br />
                    Fecha: { liquidacion.fecha_pago ? formatDate(liquidacion.fecha_pago) : 'N/A'}
                </p>
            </div>
        </div>
    )
}
