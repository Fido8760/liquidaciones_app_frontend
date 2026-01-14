import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { GastoCasetaFormData } from "../../../../types"
import ErrorMessage from "../../../ErrorMessage"

type GastoCasetaFormProps = {
    errors: FieldErrors<GastoCasetaFormData>
    register: UseFormRegister<GastoCasetaFormData>
}

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"


export default function GastoCasetaForm({ errors, register }: GastoCasetaFormProps) {
    return (
        <fieldset className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
                <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
                    Gastos en casetas
                </legend>
        
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <label htmlFor="monto" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Monto
                        </label>
                        <input
                            id="monto"
                            type="number"
                            step="0.01"
                            placeholder="Monto de casetas"
                            className={inputStyles}
                            {...register("monto", {
                            required: "Los litros son obligatorios",
                            valueAsNumber: true,
                            })}
                        />
                    {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}
                    </div>
        
                    {/* Método de pago */}
                    <div>
                        <label htmlFor="metodo_pago_caseta" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Método de pago
                        </label>
                        <select
                            id="metodo_pago_caseta"
                            className={inputStyles}
                            {...register("metodo_pago_caseta", {
                            required: "Elige un método de pago",
                            })}
                        >
                            <option value="">-- Selecciona --</option>
                            <option value="EFECTIVO">EFECTIVO</option>
                            <option value="IAVE/TAG">IAVE/TAG</option>
                        </select>
                        {errors.metodo_pago_caseta && (
                            <ErrorMessage>{errors.metodo_pago_caseta.message}</ErrorMessage>
                        )}
                    </div>
        
                    {/* Evidencia */}
                    <div className="md:col-span-2">
                        <label htmlFor="evidencia" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Evidencia (opcional)
                        </label>
                        <input
                            id="evidencia"
                            type="file"
                            accept="image/*,application/pdf"
                            className="w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-700"
                            {...register("evidencia")}
                        />
                        {errors.evidencia && (
                            <ErrorMessage>{errors.evidencia.message}</ErrorMessage>
                        )}
                    </div>
                </div>
            </fieldset>
    )
}
