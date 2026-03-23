import { useState } from "react";
import type { Liquidacion } from "../../../../types";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import FinancialRow from "../FinancialRow";

type UtilidadViajeProps = {
    liquidacion: Liquidacion;
};

export default function UtilidadViaje({ liquidacion }: UtilidadViajeProps) {
    const [showDesgloce, setShowDesgloce] = useState(false);
    const tieneGastoFerry = (liquidacion.gasto_ferry || 0) > 0;
    const gastosEmpresa = (liquidacion.gastos ?? []).filter(g => !g.afecta_operador);
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
                        } text-2xl sm:text-3xl md:text-4xl`}>
                        {formatCurrency(liquidacion.utilidad_viaje)}
                    </p>
                    <button
                        onClick={() => setShowDesgloce(!showDesgloce)}
                        className=" mt-1 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors ml-auto"
                    >
                        {showDesgloce ? (
                            <>
                                <ChevronUpIcon className=" h-3 w-3" /> Ocultar desgloce
                            </>
                        ) : (
                            <>
                                <ChevronDownIcon className=" h-3 w-3" /> Ver Desgloce
                            </>
                        )}
                    </button>
                </div>
            </div>
            {showDesgloce && (
                <div className=" mt-4 pt-4 border-t border-t-indigo-200 dark:border-t-indigo-700 space-y-2">
                    <FinancialRow 
                        label="Ingresos por fletes"
                        amount={liquidacion.total_fletes}
                        className=" text-green-600 dark:text-green-400"
                    />

                    <FinancialRow
                        label="Menos: Combustible"
                        amount={liquidacion.total_combustible}
                        isNegative
                    />

                    {tieneGastoFerry && (
                        <FinancialRow 
                            label="Menos: Ferry"
                            amount={liquidacion.gasto_ferry}
                            isNegative
                        />
                    )}

                    {gastosEmpresa.length > 0 && (
                        <>
                            <p className=" text-xs font-semibold text-gray-600 dark:text-gray-400 pt-1">
                                Menos: Gastos de la empresa
                            </p>
                            {gastosEmpresa.map(gasto => (
                                <FinancialRow 
                                    key={gasto.id}
                                    label={`${gasto.tipo_gasto.nombre}${gasto.descripcion ? ` — ${gasto.descripcion}` : ''}`}
                                    amount={gasto.monto}
                                    isNegative
                                />
                            ))}
                        </>
                    )}

                    <FinancialRow 
                        label="Menos: Pago al operador"
                        amount={liquidacion.total_neto_pagar}
                        isNegative
                    />

                    <div className=" border-t-2 border-indigo-300 dark:border-indigo-700 pt-2 mt-2">
                        <FinancialRow 
                            label="= Utilidad del Viaje"
                            amount={liquidacion.utilidad_viaje}
                            isBold
                            large className={liquidacion.utilidad_viaje >= 0 ? 'text-indigo-700 dark:text-indigo-400' : 'text-red-700 dark:text-red-400'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}