import type { Liquidacion } from "../../../types"
import LiquidacionesListaCard from "./LiquidacionesListaCard";

type LiquidacionesListadoProps = {
    liquidaciones: Liquidacion[];
}

export default function LiquidacionesListado({liquidaciones}: LiquidacionesListadoProps) {
  if (!liquidaciones.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-50 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v3.776" />
                </svg>
                <p className="text-sm font-medium">No se encontraron liquidaciones</p>
                <p className="text-xs mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
        )
    }

    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {liquidaciones.map(liquidacion => (
                <LiquidacionesListaCard key={liquidacion.id} liquidacion={liquidacion} />
            ))}
        </div>
    )
}
