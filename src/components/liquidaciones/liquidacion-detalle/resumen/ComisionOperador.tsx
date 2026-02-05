import { ExclamationTriangleIcon, PencilSquareIcon, CheckBadgeIcon, SparklesIcon, Cog6ToothIcon } from "@heroicons/react/20/solid";
import { EstadoLiquidacion, type Liquidacion } from "../../../../types";
import FinancialRow from "../FinancialRow";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import ModalModificarPago from "./ModalModificarPago";
import ModalAjustarLiquidacion from "./ModalAjustarLiquidacion";
import { formatDate } from "../../../../utils/formatDate";

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

export default function ComisionOperador({ 
    liquidacion, 
    totalAnticipos, 
    comisionFinal, 
    tieneComisionAjustada, 
    tieneAjusteRendimiento, 
    tieneAhorroDiesel, 
    tieneExcesoDiesel, 
    tieneAjusteManual 
}: ComisionOperadorProps) {
    const { data: user } = useAuth();
    const [isModalModificarOpen, setIsModalModificarOpen] = useState(false);
    const [isModalAjustarOpen, setIsModalAjustarOpen] = useState(false);
    
    const isDirector = user?.rol === 'DIRECTOR' || user?.rol === 'ADMIN' || user?.rol === 'SISTEMAS';
    const puedeAjustar = isDirector && liquidacion.estado === EstadoLiquidacion.APROBADA;
    const tieneRendimientoTabulado = liquidacion.rendimiento_tabulado > 0;
    
    return (
        <div className="mb-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            
            {/* 🎯 HEADER con botón de ajustar */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 dark:bg-purple-700 text-white font-bold">
                        3
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-300 text-lg">
                            Comisión del Operador ({liquidacion.comision_porcentaje}%)
                        </h3>
                        <p className="text-xs text-purple-700 dark:text-purple-400">
                            {liquidacion.unidad.tipo_unidad}
                        </p>
                    </div>
                </div>

                {/* Botón de ajustar en el header */}
                {puedeAjustar && (
                    <button
                        onClick={() => setIsModalAjustarOpen(true)}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Ajustar rendimiento y comisión"
                    >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Ajustar</span>
                    </button>
                )}
            </div>
            
            {/* 🎯 SI NO TIENE RENDIMIENTO TABULADO */}
            {!tieneRendimientoTabulado ? (
                <div className="py-12">
                    <div className="text-center max-w-md mx-auto">
                        {/* Ícono */}
                        <div className="mb-4 flex justify-center">
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                                <svg 
                                    className="w-12 h-12 text-purple-600 dark:text-purple-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Mensaje */}
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Rendimiento Tabulado No Configurado
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Para calcular la comisión del operador, primero debes configurar el rendimiento tabulado y el porcentaje de comisión.
                        </p>

                        {/* Botón */}
                        {puedeAjustar && (
                            <button
                                onClick={() => setIsModalAjustarOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                                Configurar Ahora
                            </button>
                        )}

                        {!puedeAjustar && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                    Solo directores y administradores pueden configurar el rendimiento en liquidaciones aprobadas.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* 🎯 SI TIENE RENDIMIENTO TABULADO - MOSTRAR DESGLOSE */
                <div className="space-y-2 pl-13">
                    <FinancialRow 
                        label="Base para comisión (Flete - Diesel)"
                        amount={liquidacion.total_costo_fletes - liquidacion.total_combustible}
                        className="text-blue-600 dark:text-blue-400"
                    />

                    <FinancialRow 
                        label={`Comisión ${liquidacion.comision_porcentaje}% sobre base`}
                        amount={liquidacion.comision_estimada} 
                        className="text-purple-600 dark:text-purple-400 font-medium"
                    />

                    {tieneComisionAjustada && (
                        <div className="my-2 pl-4 border-l-4 border-yellow-400 dark:border-yellow-600">
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

                    <div className="border-t border-purple-200 dark:border-purple-700 pt-2 mt-2 mb-3">
                        <FinancialRow 
                            label="Subtotal: Comisión"
                            amount={comisionFinal}
                            isBold
                            className="text-purple-700 dark:text-purple-400"
                        />
                    </div>

                    {tieneAjusteRendimiento && (
                        <>
                            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mt-3 mb-2">
                                Ajustes por Rendimiento de Combustible:
                            </p>
                            {tieneAhorroDiesel && (
                                <FinancialRow 
                                    label="+ Bono: Ahorro de Diesel"
                                    amount={liquidacion.diesel_a_favor_sin_iva}
                                    className="text-green-600 dark:text-green-400 font-medium"
                                />
                            )}
                            {tieneExcesoDiesel && (
                                <FinancialRow 
                                    label="- Cargo: Exceso de Diesel"
                                    amount={liquidacion.diesel_en_contra_sin_iva}
                                    isNegative
                                    className="text-red-600 dark:text-red-400 font-medium"
                                />
                            )}
                        </>
                    )}

                    {tieneAjusteManual && (
                        <>
                            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mt-3 mb-2">
                                Descuento o ajuste manual:
                            </p>
                            <FinancialRow 
                                label="Descuento aplicado"
                                amount={Math.abs(liquidacion.ajuste_manual)}
                                isNegative
                            />
                            {liquidacion.motivo_ajuste && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic pl-4 mt-1">
                                    Motivo: {liquidacion.motivo_ajuste}
                                </p>
                            )}
                        </>
                    )}

                    <div className="border-t-2 border-purple-300 dark:border-purple-700 pt-3 mt-3 mb-3">
                        <FinancialRow 
                            label="= Total Bruto (antes de anticipos)"
                            amount={liquidacion.total_bruto}
                            isBold
                            large
                            className="text-purple-700 dark:text-purple-400"
                        />
                    </div>

                    {totalAnticipos > 0 && (
                        <>
                            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">
                                Menos: Anticipos Entregados
                            </p>
                            <FinancialRow 
                                label="Anticipos al Operador"
                                amount={totalAnticipos}
                                isNegative
                            />
                        </>
                    )}

                    <div className="border-t-2 border-purple-400 dark:border-purple-600 pt-4 mt-4 -mx-5 px-5 pb-4">
                        {/* Header con estado */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                                    TOTAL A PAGAR AL OPERADOR
                                </span>
                                {liquidacion.total_modificado_manualmente ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                                        <SparklesIcon className="w-3 h-3" />
                                        Modificado
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                        <CheckBadgeIcon className="w-3 h-3" />
                                        Sistema
                                    </span>
                                )}
                            </div>

                            {puedeAjustar && (
                                <button
                                    onClick={() => setIsModalModificarOpen(true)}
                                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    title="Modificar total a pagar"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Modificar</span>
                                </button>
                            )}
                        </div>

                        {/* Monto principal */}
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl p-4 border-2 border-purple-300 dark:border-purple-700">
                            <div className="text-center">
                                <p className={`text-4xl font-black ${
                                    liquidacion.total_neto_pagar >= 0 
                                        ? "text-purple-800 dark:text-purple-300" 
                                        : "text-red-700 dark:text-red-400"
                                }`}>
                                    {formatCurrency(liquidacion.total_neto_pagar)}
                                </p>
                            </div>

                            {/* Info adicional si fue modificado */}
                            {liquidacion.total_modificado_manualmente && liquidacion.total_neto_sugerido !== null && (
                                <div className="mt-3 pt-3 border-t border-purple-300 dark:border-purple-700">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Sistema sugería:
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {formatCurrency(liquidacion.total_neto_sugerido)}
                                        </span>
                                    </div>
                                    <div className={`flex items-center justify-between text-xs mt-1 ${
                                        liquidacion.total_neto_pagar > liquidacion.total_neto_sugerido
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                        <span>Diferencia:</span>
                                        <span className="font-bold">
                                            {liquidacion.total_neto_pagar > liquidacion.total_neto_sugerido ? '+' : ''}
                                            {formatCurrency(liquidacion.total_neto_pagar - liquidacion.total_neto_sugerido)}
                                            {' '}
                                            ({((liquidacion.total_neto_pagar - liquidacion.total_neto_sugerido) / liquidacion.total_neto_sugerido * 100).toFixed(1)}%)
                                        </span>
                                    </div>

                                    {liquidacion.usuario_modificador_total && (
                                        <div className="mt-3 pt-2 border-t border-purple-200 dark:border-purple-800">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Modificado por:</span>{' '}
                                                {liquidacion.usuario_modificador_total.nombre}{' '}
                                                {liquidacion.usuario_modificador_total.apellido}
                                            </p>
                                            {liquidacion.fecha_modificacion_total && (
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                                    {formatDate(liquidacion.fecha_modificacion_total)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Advertencia si debe dinero */}
                    {liquidacion.total_neto_pagar < 0 && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"/>
                            <p className="text-sm text-red-800 dark:text-red-300">
                                <strong>El operador debe {formatCurrency(Math.abs(liquidacion.total_neto_pagar))} a la empresa</strong>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modales */}
            {isModalModificarOpen && (
                <ModalModificarPago 
                    liquidacion={liquidacion}
                    onClose={() => setIsModalModificarOpen(false)}
                />
            )}

            {isModalAjustarOpen && (
                <ModalAjustarLiquidacion 
                    liquidacion={liquidacion}
                    onClose={() => setIsModalAjustarOpen(false)}
                />
            )}
        </div>
    );
}