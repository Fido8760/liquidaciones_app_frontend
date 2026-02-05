import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AjustarFormData, Liquidacion } from "../../../../types";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { formatCurrency } from "../../../../utils/formatCurrency";
import ErrorMessage from "../../../ErrorMessage";
import { ajusteLiquidacion } from "../../../../api/LiquidacionAPI";
import { toast } from "react-toastify";

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white";
const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

type ModalAjustarLiquidacionProps = {
  liquidacion: Liquidacion;
  onClose: () => void;
};

export default function ModalAjustarLiquidacion({ liquidacion, onClose }: ModalAjustarLiquidacionProps) {
  const queryClient = useQueryClient();

  const initialValues: AjustarFormData = {
    rendimiento_tabulado: liquidacion.rendimiento_tabulado || 0,
    comision_porcentaje: liquidacion.comision_porcentaje || 0,
    ajuste_manual: liquidacion.ajuste_manual || 0,
    motivo_ajuste: liquidacion.motivo_ajuste || "",
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AjustarFormData>({ 
    defaultValues: initialValues 
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ajusteLiquidacion,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["liquidacion", liquidacion.id] });
      onClose();
    }
  });

  const watchComision = watch("comision_porcentaje");
  const watchAjuste = watch("ajuste_manual");
  const requiereMotivo = watchAjuste !== 0;

  // ═══════════════════════════════════════════════════
  // CÁLCULOS CORRECTOS (igual que el backend)
  // ═══════════════════════════════════════════════════
  
  // 1. Base para comisión
  const baseComision = liquidacion.total_costo_fletes - liquidacion.total_combustible;
  
  // 2. Comisión según el porcentaje ajustado
  const comisionCalculada = baseComision * (watchComision / 100);
  
  // 3. Bono diesel a favor (si ahorró diesel)
  const bonoDiesel = liquidacion.diesel_a_favor_sin_iva || 0;
  
  // 4. Total Bruto = Comisión + Bono diesel - Ajuste manual
  const totalBruto = comisionCalculada + bonoDiesel - watchAjuste;
  
  // 5. Anticipos
  const totalAnticipos = liquidacion.anticipos?.reduce((sum, ant) => sum + ant.monto, 0) || 0;
  
  // 6. Total Neto = Total Bruto - Anticipos
  const totalNeto = totalBruto - totalAnticipos;

  const handleForm = (formData: AjustarFormData) => {
    const dataToSend = {
      liquidacionId: liquidacion.id,
      formData
    };
    mutate(dataToSend);
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Ajustar Liquidación
                      </Dialog.Title>
                      <p className="text-purple-100 text-sm mt-2">
                        Folio: <strong>#{liquidacion.folio_liquidacion}</strong> |
                        Operador: <strong>{liquidacion.operador.nombre} {liquidacion.operador.apellido_p} {liquidacion.operador.apellido_m}</strong>
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-lg p-2 hover:bg-white/20 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Rendimiento Real</p>
                      <p className="font-bold text-blue-700 dark:text-blue-400">
                        {liquidacion.rendimiento_real || 0} km/l
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Base Comisión</p>
                      <p className="font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(baseComision)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Anticipos</p>
                      <p className="font-bold text-blue-700 dark:text-blue-400">
                        {formatCurrency(totalAnticipos)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(handleForm)} className="p-6" noValidate>
                  <div className="space-y-6">
                    
                    {/* Parámetros de Cálculo */}
                    <fieldset className="p-4 border dark:border-gray-700 rounded-lg">
                      <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
                        Parámetros de Cálculo
                      </legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">

                        {/* Rendimiento Tabulado */}
                        <div>
                          <label htmlFor="rendimiento_tabulado" className={labelStyles}>
                            Rendimiento Tabulado (km/l) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="rendimiento_tabulado"
                            className={inputStyles}
                            placeholder="4.50"
                            {...register("rendimiento_tabulado", {
                              required: "El rendimiento es obligatorio",
                              min: { value: 0.1, message: "Debe ser mayor a 0" },
                              valueAsNumber: true,
                            })}
                          />
                          <ErrorMessage>{errors.rendimiento_tabulado?.message}</ErrorMessage>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Se compara con el rendimiento real ({liquidacion.rendimiento_real || 0} km/l)
                          </p>
                        </div>

                        {/* Comisión */}
                        <div>
                          <label htmlFor="comision_porcentaje" className={labelStyles}>
                            Comisión del Operador (%) *
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            id="comision_porcentaje"
                            className={inputStyles}
                            placeholder="18"
                            {...register("comision_porcentaje", {
                              required: "La comisión es obligatoria",
                              min: { value: 0, message: "Debe ser mayor o igual a 0" },
                              max: { value: 100, message: "No puede ser mayor a 100" },
                              valueAsNumber: true,
                            })}
                          />
                          <ErrorMessage>{errors.comision_porcentaje?.message}</ErrorMessage>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {watchComision}% de {formatCurrency(baseComision)} = {" "}
                            <strong className="text-purple-600 dark:text-purple-400">
                              {formatCurrency(comisionCalculada)}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </fieldset>

                    {/* Ajustes Adicionales */}
                    <fieldset className="p-4 border dark:border-gray-700 rounded-lg">
                      <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
                        Ajustes Adicionales (Opcional)
                      </legend>
                      <div className="grid grid-cols-1 gap-y-5 mt-2">
                        <div>
                          <label htmlFor="ajuste_manual" className={labelStyles}>
                            Ajuste Manual ($)
                          </label>
                          <input 
                            type="number"
                            step="0.01"
                            id="ajuste_manual"
                            className={inputStyles}
                            placeholder="0.00"
                            {...register('ajuste_manual', {
                              valueAsNumber: true
                            })} 
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <strong>Positivo:</strong> Descuento/cargo al operador (ej: golpe en unidad) |{" "}
                            <strong>Negativo:</strong> Bono/bonificación al operador
                          </p>
                        </div>
                        
                        {requiereMotivo && (
                          <div>
                            <label htmlFor="motivo_ajuste" className={labelStyles}>
                              Motivo del Ajuste *
                            </label>
                            <textarea
                              id="motivo_ajuste"
                              rows={3}
                              className={inputStyles + " resize-none"}
                              placeholder="Ej: Descuento por daño en unidad, Bono por excelente rendimiento..."
                              {...register('motivo_ajuste', { 
                                required: requiereMotivo ? 'Debe indicar el motivo del ajuste' : false 
                              })}
                            />
                            <ErrorMessage>{errors.motivo_ajuste?.message}</ErrorMessage>
                          </div>
                        )}
                      </div>
                    </fieldset>
                    
                    {/* Vista Previa del Cálculo */}
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Vista Previa del Pago
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        {/* Comisión */}
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            Comisión ({watchComision}%)
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(comisionCalculada)}
                          </span>
                        </div>

                        {/* Bono diesel a favor */}
                        {bonoDiesel > 0 && (
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-400">
                              + Bono Ahorro Diesel
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(bonoDiesel)}
                            </span>
                          </div>
                        )}

                        {/* Ajuste manual */}
                        {watchAjuste !== 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              {watchAjuste > 0 ? '- Ajuste/Descuento' : '+ Bono/Bonificación'}
                            </span>
                            <span className={`font-semibold ${
                              watchAjuste > 0 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-green-600 dark:text-green-400'
                            }`}>
                              {watchAjuste > 0 ? '-' : '+'}{formatCurrency(Math.abs(watchAjuste))}
                            </span>
                          </div>
                        )}

                        {/* Total Bruto */}
                        <div className="border-t border-purple-300 dark:border-purple-600 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              = Total Bruto
                            </span>
                            <span className="font-bold text-purple-700 dark:text-purple-400">
                              {formatCurrency(totalBruto)}
                            </span>
                          </div>
                        </div>

                        {/* Anticipos */}
                        {totalAnticipos > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              - Anticipos
                            </span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              -{formatCurrency(totalAnticipos)}
                            </span>
                          </div>
                        )}

                        {/* Total Neto */}
                        <div className="border-t-2 border-purple-300 dark:border-purple-600 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-purple-900 dark:text-purple-300">
                              = TOTAL NETO A PAGAR
                            </span>
                            <span className={`text-2xl font-bold ${
                              totalNeto >= 0 
                                ? 'text-purple-700 dark:text-purple-400' 
                                : 'text-red-700 dark:text-red-400'
                            }`}>
                              {formatCurrency(totalNeto)}
                            </span>
                          </div>
                        </div>

                        {/* Advertencia si debe dinero */}
                        {totalNeto < 0 && (
                          <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700">
                            <p className="text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <strong>
                                El operador deberá {formatCurrency(Math.abs(totalNeto))} a la empresa
                              </strong>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/30"
                      >
                        {isPending ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Ajustes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}