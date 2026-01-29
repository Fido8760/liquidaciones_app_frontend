import type { Liquidacion } from "../../../../types";
import { formatCurrency } from "../../../../utils/formatCurrency";

type UtilidadViajeProps = {
    liquidacion: Liquidacion;
};

export default function UtilidadViaje({ liquidacion }: UtilidadViajeProps) {
    return (
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-400 dark:border-indigo-600 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xl shrink-0">
                        ✓
                    </div>
                    <div>
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 text-lg md:text-xl">
                            Utilidad del Viaje
                        </h3>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">
                            Ganancia neta de la empresa
                        </p>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <p className={`font-bold break-words leading-tight ${
                        liquidacion.utilidad_viaje >= 0
                            ? 'text-indigo-700 dark:text-indigo-400'
                            : 'text-red-700 dark:text-red-400'
                        }
                        text-2xl sm:text-3xl md:text-4xl
                    `}>
                        {formatCurrency(liquidacion.utilidad_viaje)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Flete - Diesel - Casetas - Varios - Comisión - Deducciones
                    </p>
                </div>
            </div>
        </div>
    );
}