import { ChartBarIcon } from "@heroicons/react/20/solid"
import { type Liquidacion } from "../../../../types"
import ComisionOperador from "./ComisionOperador"
import UtilidadViaje from "./UtilidadViaje"
import { formatCurrency } from "../../../../utils/formatCurrency"
import FinancialRow from "../FinancialRow"


type DesgloceFinancieroProps = {
    liquidacion: Liquidacion
    totalAnticipos: number
    comisionFinal: number
    tieneComisionAjustada: boolean
    tieneAjusteRendimiento: boolean
    tieneAhorroDiesel: boolean
    tieneExcesoDiesel: boolean
    tieneAjusteManual: boolean
}

export default function DesgloceFinanciero({ liquidacion, totalAnticipos, comisionFinal, tieneComisionAjustada, tieneAjusteRendimiento, tieneAhorroDiesel, tieneExcesoDiesel, tieneAjusteManual }: DesgloceFinancieroProps) {
    const tieneGastoFerry = (liquidacion.gasto_ferry || 0) > 0;
    const baseComision = liquidacion.total_fletes - liquidacion.total_combustible - (liquidacion.gasto_ferry || 0); // ✅

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Desgloce Financiero
            </h2>

            {/* PASO 1: Ingresos por Fletes */}
            <div className="mb-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 dark:bg-green-700 text-white font-bold">1</div>
                        <div>
                            <h3 className="font-semibold text-green-900 dark:text-green-300 text-lg">Ingresos por Fletes</h3>
                            <p className="text-xs text-green-700 dark:text-green-400">Total facturado al cliente</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                        {formatCurrency(liquidacion.total_fletes)} {/* ✅ */}
                    </p>
                </div>
            </div>

            {/* PASO 2: Base de Comisión */}
            <div className="mb-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 text-white font-bold">2</div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-lg">Cálculo de base para Comisión</h3>
                </div>
                <div className="space-y-2 pl-13">
                    <FinancialRow label="Ingreso por Flete" amount={liquidacion.total_fletes} className="text-green-600 dark:text-green-400" /> {/* ✅ */}
                    <FinancialRow label="Menos: Combustible Total" amount={liquidacion.total_combustible} isNegative />
                    {tieneGastoFerry && (
                        <FinancialRow label="Menos: Gasto de Ferry" amount={liquidacion.gasto_ferry!} isNegative className="text-orange-600 dark:text-orange-400" />
                    )}
                    <div className="border-t-2 border-blue-300 dark:border-blue-700 pt-2 mt-2">
                        <FinancialRow label="= Base para Cálculo de Comisión" amount={baseComision} isBold large className="text-blue-700 dark:text-blue-400" />
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 pl-4">
                            Sobre este monto se calcula el {liquidacion.comision_porcentaje}% de comisión del operador
                        </p>
                    </div>
                </div>
            </div>

            {/* PASO 3: Comisión del Operador */}
            <ComisionOperador
                liquidacion={liquidacion}
                totalAnticipos={totalAnticipos}
                comisionFinal={comisionFinal}
                tieneComisionAjustada={tieneComisionAjustada}
                tieneAjusteRendimiento={tieneAjusteRendimiento}
                tieneAhorroDiesel={tieneAhorroDiesel}
                tieneExcesoDiesel={tieneExcesoDiesel}
                tieneAjusteManual={tieneAjusteManual}
            />

            {/* PASO 4: Gastos Operativos — ahora unificados en total_gastos */}
            {liquidacion.total_gastos > 0 && (
                <div className="mb-4 p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 dark:bg-orange-700 text-white font-bold">4</div>
                        <h3 className="font-semibold text-orange-900 dark:text-orange-300 text-lg">Gastos Operativos</h3>
                    </div>
                    <div className="space-y-2 pl-13">
                        {liquidacion.total_gastos_empresa > 0 && (
                            <FinancialRow
                                label="Gastos de la empresa (casetas, comidas, etc.)"
                                amount={liquidacion.total_gastos_empresa}
                                isNegative
                            />
                        )}
                        {(liquidacion.total_gastos - liquidacion.total_gastos_empresa) > 0 && (
                            <FinancialRow
                                label="Cargos al operador (descuentos, etc.)"
                                amount={liquidacion.total_gastos - liquidacion.total_gastos_empresa}
                                isNegative
                                className="text-red-600 dark:text-red-400"
                            />
                        )}
                        <div className="border-t border-orange-200 dark:border-orange-700 pt-2 mt-2">
                            <FinancialRow
                                label="Total gastos"
                                amount={liquidacion.total_gastos}
                                isNegative
                                isBold
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* PASO 5: Utilidad del Viaje */}
            <UtilidadViaje liquidacion={liquidacion} />
        </section>
    );
}