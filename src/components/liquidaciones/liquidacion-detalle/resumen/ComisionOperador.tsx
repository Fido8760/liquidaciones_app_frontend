import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { Liquidacion } from "../../../../types";
import FinancialRow from "../FinancialRow";
import { formatCurrency } from "../../../../utils/formatCurrency";

type ComisionOperadorProps = {
    liquidacion: Liquidacion;
    totalAnticipos: number;
    comisionFinal: number;
    tieneComisionAjustada: boolean;
    tieneAjusteRendimiento: boolean;
    tieneAhorroDiesel: boolean;
    tieneExcesoDiesel: boolean;
    tieneAjusteManual: boolean;
};
export default function ComisionOperador({ liquidacion, totalAnticipos, comisionFinal, tieneComisionAjustada, tieneAjusteRendimiento, tieneAhorroDiesel, tieneExcesoDiesel, tieneAjusteManual}: ComisionOperadorProps) {
    return (
        <div className=" mb-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className=" flex items-center gap-3 mb-3">
                <div className=" flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 dark:bg-purple-700 text-white font-bold">
                    3
                </div>
                <div>
                    <h3 className=" font-semibold text-purple-900 dark:text-purple-300 text-lg">Comisión del Operador ({liquidacion.comision_porcentaje}%)</h3>
                    <p className=" text-xs text-purple-700 dark:text-purple-400">{liquidacion.unidad.tipo_unidad}</p>
                </div>
            </div>
            <div className=" space-y-2 pl-13">
                <FinancialRow 
                    label="Base para comisión (Flete - Diesel)"
                    amount={liquidacion.total_costo_fletes - liquidacion.total_combustible}
                    className=" text-blue-600 dark:text-blue-400"
                />

                <FinancialRow 
                    label={`Comisión ${liquidacion.comision_porcentaje}% sobre base`}
                    amount={liquidacion.comision_estimada} 
                    className="text-purple-600 dark:text-purple-400 font-medium"
                />

                {tieneComisionAjustada && (
                    <div className=" my-2 pl-4 border-l-4 border-yellow-400 dark:border-yellow-600">
                        <FinancialRow 
                            label="Comisión Ajustada Manualmente" 
                            amount={liquidacion.comision_pagada!} 
                            isBold
                            className="text-yellow-700 dark:text-yellow-400"
                        />
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                            El director modificó la comisión estimada
                        </p>
                    </div>
                )}

                <div className=" border-t border-purple-200 dark:border-purple-700 pt-2 mt-2 mb-3">
                    <FinancialRow 
                        label="Subtotal: Comisión"
                        amount={comisionFinal}
                        isBold
                        className=" text-purple-700 dark:text-purple-400"
                    />
                </div>
                {tieneAjusteRendimiento && (
                    <>
                        <p className=" text-xs font-semibold text-purple-800 dark:text-purple-300 mt-3 mb-2">Ajustes por Rendimiento de Combustible:</p>
                        {tieneAhorroDiesel && (
                            <FinancialRow 
                                label="+ Bono: Ahorro de Diesel"
                                amount={liquidacion.diesel_a_favor_sin_iva}
                                className=" text-green-600 dark:text-green-400 font-medium"
                            />
                        )}
                        {tieneExcesoDiesel && (
                            <FinancialRow 
                                label="- Cargo: Exceso de Diesel"
                                amount={liquidacion.diesel_en_contra_sin_iva}
                                isNegative
                                className=" text-red-600 dark:text-red-400 font-medium"
                            />
                        )}
                    </>
                )}
                {tieneAjusteManual &&  (
                    <>
                        <p className=" text-xs font-semibold text-purple-800 dark:text-purple-300 mt-3 mb-2">Ajuste Manual:</p>
                        <FinancialRow 
                            label={liquidacion.ajuste_manual > 0 ? '- Ajuste Adicional' : '- Descuento Aplicado'}
                            amount={Math.abs(liquidacion.ajuste_manual)}
                            isNegative={liquidacion.ajuste_manual < 0}
                            className={liquidacion.ajuste_manual > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                        />
                        {liquidacion.motivo_ajuste && (
                            <p className=" text-xs text-gray-600 dark:text-gray-400 italic pl-4 mt-1">Motivo: {liquidacion.motivo_ajuste}</p>
                        )}
                    </>
                )}
                <div className=" border-t-2 border-purple-300 dark:border-purple-700 pt-3 mt-3 mb-3">
                    <FinancialRow 
                        label="= Total Bruto (antes de anticipos)"
                        amount={liquidacion.total_bruto}
                        isBold
                        large
                        className=" text-purple-700 dark:text-purple-400"
                    />
                </div>
                {totalAnticipos > 0 && (
                    <>
                        <p className=" text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">Menos: Anticipos Entregados</p>
                        <FinancialRow 
                            label="Anticipos al Operador"
                            amount={totalAnticipos}
                            isNegative
                        />
                    </>
                )}

                <div className=" border-t-2 border-purple-400 dark:border-purple-600 pt-3 mt-3 bg-purple-100/50 dark:bg-purple-900/30 -mx-5 px-5 py-3 rounded-b-lg">
                    <FinancialRow
                        label="= TOTAL A PAGAR AL OPERADOR"
                        amount={liquidacion.total_neto_pagar}
                        isBold
                        large
                        className={liquidacion.total_neto_pagar >= 0 ? "text-purple-800 dark:text-purple-300" : "text-red-700 dark:text-red-400"}
                    />
                </div>
                {liquidacion.total_neto_pagar < 0 && (
                    <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"/>
                        <p className="text-sm text-red-800 dark:text-red-300">
                            <strong>El operador debe {formatCurrency(Math.abs(liquidacion.total_neto_pagar))} a la empresa</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
