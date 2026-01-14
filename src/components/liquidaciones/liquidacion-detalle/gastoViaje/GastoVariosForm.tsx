import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { GastoVarioFormData } from "../../../../types";
import ErrorMessage from "../../../ErrorMessage";

type GastoVariosFormProps = {
  register: UseFormRegister<GastoVarioFormData>;
  errors: FieldErrors<GastoVarioFormData>;
};

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500";

export default function GastoVariosForm({ register, errors }: GastoVariosFormProps) {
    
    return (
        <fieldset className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
            <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
                Otros gastos
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label
                        htmlFor="monto"
                        className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
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

                <div>
                    <label
                        htmlFor="concepto"
                        className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                        Concepto
                    </label>
                    <input
                        id="concepto"
                        type="text"
                        placeholder="Concepto de gastos"
                        className={inputStyles}
                        {...register("concepto", {
                            required: "El concepto es obligatorio",
                        })}
                    />
                    {errors.concepto && <ErrorMessage>{errors.concepto?.message}</ErrorMessage>}
                </div>
                <div>
                    <label
                        htmlFor="observaciones"
                        className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                        Observaciones
                    </label>
                    <textarea
                        id="observaciones"
                        placeholder="observaciones de gastos"
                        className={inputStyles}
                        {...register("observaciones", {
                            required: "Las observaciones son obligatorias"
                        })}
                    />
                    {errors.observaciones && <ErrorMessage>{errors.observaciones?.message}</ErrorMessage>}
                </div>

                {/* Evidencia */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="evidencia"
                        className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
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
