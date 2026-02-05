import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { formatCurrency } from "../../../../utils/formatCurrency";
import type { Liquidacion } from "../../../../types";
import { modificarTotalPago } from "../../../../api/LiquidacionAPI";
import { toast } from "react-toastify";

type ModalModificarPagoProps = {
    liquidacion: Liquidacion;
    onClose: () => void;
};

export default function ModalModificarPago({ liquidacion, onClose }: ModalModificarPagoProps) {
    const queryClient = useQueryClient();
    const [nuevoTotal, setNuevoTotal] = useState<string>(liquidacion.total_neto_pagar.toString());

    // Mutation para modificar el total
    const { mutate, isPending } = useMutation({
        mutationFn: modificarTotalPago,
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacion.id] });
            queryClient.invalidateQueries({ queryKey: ['liquidaciones'] });
            onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const totalNumerico = parseFloat(nuevoTotal);
        
        if (isNaN(totalNumerico)) {
            toast.error('Ingresa un monto válido');
            return;
        }
        
        if (totalNumerico < 0) {
            toast.error('El total no puede ser negativo');
            return;
        }

        mutate({
            liquidacionId: liquidacion.id,
            formData: { total_neto_pagar: totalNumerico }
        });
    };

    // Calcular preview
    const totalNumerico = parseFloat(nuevoTotal) || 0;
    const totalSugerido = liquidacion.total_modificado_manualmente 
        ? liquidacion.total_neto_sugerido || liquidacion.total_neto_pagar 
        : liquidacion.total_neto_pagar;
    const totalActual = liquidacion.total_neto_pagar;
    
    const diferenciaVsSugerido = totalNumerico - totalSugerido;
    const diferenciaVsActual = totalNumerico - totalActual;
    const porcentajeCambio = totalSugerido > 0
        ? ((diferenciaVsSugerido / totalSugerido) * 100).toFixed(2)
        : '0';
    
    const tipoCambio = diferenciaVsActual > 0 ? 'AUMENTO' : diferenciaVsActual < 0 ? 'REDUCCIÓN' : 'SIN CAMBIO';
    const hayDiferencia = Math.abs(diferenciaVsActual) > 0.01;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Modificar Total a Pagar
                            </h2>
                            <p className="text-purple-100 text-sm mt-1">
                                Liquidación: #{liquidacion.folio_liquidacion}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Cálculo del Sistema */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                💡
                            </div>
                            <h3 className="font-bold text-blue-900 dark:text-blue-300">
                                Cálculo del Sistema
                            </h3>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-700 dark:text-gray-300">Comisión ({liquidacion.comision_porcentaje}%):</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(liquidacion.comision_pagada ?? liquidacion.comision_estimada)}
                                </span>
                            </div>
                            
                            {liquidacion.diesel_a_favor_sin_iva > 0 && (
                                <div className="flex justify-between text-green-700 dark:text-green-400">
                                    <span>+ Ahorro Diesel:</span>
                                    <span className="font-medium">
                                        {formatCurrency(liquidacion.diesel_a_favor_sin_iva)}
                                    </span>
                                </div>
                            )}
                            
                            {liquidacion.ajuste_manual !== 0 && (
                                <div className="flex justify-between text-orange-700 dark:text-orange-400">
                                    <span>{liquidacion.ajuste_manual > 0 ? '- Ajuste Manual:' : '+ Bono Manual:'}</span>
                                    <span className="font-medium">
                                        {formatCurrency(Math.abs(liquidacion.ajuste_manual))}
                                    </span>
                                </div>
                            )}
                            
                            <div className="border-t border-blue-300 dark:border-blue-700 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Total Bruto:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(liquidacion.total_bruto)}
                                    </span>
                                </div>
                            </div>
                            
                            {liquidacion.anticipos && liquidacion.anticipos.length > 0 && (
                                <div className="flex justify-between text-purple-700 dark:text-purple-400">
                                    <span>- Anticipos:</span>
                                    <span className="font-medium">
                                        {formatCurrency(
                                            liquidacion.anticipos.reduce((sum, ant) => sum + ant.monto, 0)
                                        )}
                                    </span>
                                </div>
                            )}
                            
                            <div className="border-t-2 border-blue-400 dark:border-blue-600 pt-2 mt-2">
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-blue-900 dark:text-blue-300">
                                        Sistema Sugiere:
                                    </span>
                                    <span className="font-bold text-blue-700 dark:text-blue-400">
                                        {formatCurrency(totalSugerido)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input del Director */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                                👤
                            </div>
                            <h3 className="font-bold text-purple-900 dark:text-purple-300">
                                Decisión del Director
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Total a Pagar al Operador
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={nuevoTotal}
                                        onChange={(e) => setNuevoTotal(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-xl font-bold border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all"
                                        placeholder="0.00"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            {/* Preview del cambio */}
                            {hayDiferencia && (
                                <div className={`p-4 rounded-lg border-2 ${
                                    tipoCambio === 'AUMENTO' 
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {tipoCambio === 'AUMENTO' && '📈 Aumento'}
                                            {tipoCambio === 'REDUCCIÓN' && '📉 Reducción'}
                                        </span>
                                        <span className={`text-lg font-bold ${
                                            tipoCambio === 'AUMENTO' ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
                                        }`}>
                                            {diferenciaVsActual > 0 ? '+' : ''}
                                            {formatCurrency(diferenciaVsActual)}
                                        </span>
                                    </div>
                                    
                                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                        <div className="flex justify-between">
                                            <span>vs Sistema:</span>
                                            <span className="font-medium">
                                                {diferenciaVsSugerido > 0 ? '+' : ''}
                                                {formatCurrency(diferenciaVsSugerido)} ({porcentajeCambio}%)
                                            </span>
                                        </div>
                                        {liquidacion.total_modificado_manualmente && (
                                            <div className="flex justify-between">
                                                <span>vs Total Actual:</span>
                                                <span className="font-medium">
                                                    {diferenciaVsActual > 0 ? '+' : ''}
                                                    {formatCurrency(diferenciaVsActual)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Advertencia si ya fue modificado */}
                    {liquidacion.total_modificado_manualmente && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                                        Esta liquidación ya fue modificada anteriormente
                                    </p>
                                    <div className="text-xs text-yellow-800 dark:text-yellow-400 space-y-1">
                                        {liquidacion.usuario_modificador_total && (
                                            <>
                                                <p>
                                                    <strong>Modificado por:</strong>{' '}
                                                    {liquidacion.usuario_modificador_total.nombre}{' '}
                                                    {liquidacion.usuario_modificador_total.apellido}
                                                </p>
                                                {liquidacion.fecha_modificacion_total && (
                                                    <p>
                                                        <strong>Fecha:</strong>{' '}
                                                        {new Date(liquidacion.fecha_modificacion_total).toLocaleString('es-MX')}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !hayDiferencia}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                'Confirmar Cambio'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}