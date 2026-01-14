import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import ErrorMessage from "../../../ErrorMessage"
import type { GastoCombustibleFormData } from "../../../../types"
import { useEffect } from "react"

type GastoCombustibleFormProps = {
  errors: FieldErrors<GastoCombustibleFormData>
  register: UseFormRegister<GastoCombustibleFormData>
  watch: UseFormWatch<GastoCombustibleFormData>
  setValue: UseFormSetValue<GastoCombustibleFormData>
}

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"

export default function GastoCombustibleForm({ errors, register, watch, setValue }: GastoCombustibleFormProps) {

    const litros = watch("litros");
    const precioLitro = watch("precio_litro");

    useEffect(() => {
        if (!isNaN(litros) && !isNaN(precioLitro)) {
            const calculado = +(litros * precioLitro).toFixed(2); // Redondea a 2 decimales
            setValue("monto", calculado);
        }
    }, [litros, precioLitro, setValue]);

    return (

    <fieldset className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
        <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
            Gasto de Combustible
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Litros */}
            <div>
                <label htmlFor="litros" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Litros
                </label>
                <input
                    id="litros"
                    type="number"
                    step="0.01"
                    placeholder="Litros cargados"
                    className={inputStyles}
                    {...register("litros", {
                    required: "Los litros son obligatorios",
                    valueAsNumber: true,
                    })}
                />
            {errors.litros && <ErrorMessage>{errors.litros.message}</ErrorMessage>}
            </div>

            {/* Precio por litro */}
            <div>
                <label htmlFor="precio_litro" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Precio por litro
                </label>
                <input
                    id="precio_litro"
                    type="number"
                    step="0.01"
                    placeholder="Ej. 24.50"
                    className={inputStyles}
                    {...register("precio_litro", {
                    required: "El precio por litro es obligatorio",
                    valueAsNumber: true,
                    })}
                />
                {errors.precio_litro && (
                    <ErrorMessage>{errors.precio_litro.message}</ErrorMessage>
                )}
            </div>

            {/* Monto */}
            <div>
                <label htmlFor="monto" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Monto total
                </label>
                <input
                    id="monto"
                    type="number"
                    step="0.01"
                    placeholder="Ej. 980.00"
                    className={inputStyles}
                    readOnly
                    {...register("monto", {
                    required: "El monto es obligatorio",
                    valueAsNumber: true,
                    })}
                />
                {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}
            </div>

            {/* Método de pago */}
            <div>
                <label htmlFor="metodo_pago" className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Método de pago
                </label>
                <select
                    id="metodo_pago"
                    className={inputStyles}
                    {...register("metodo_pago", {
                    required: "Elige un método de pago",
                    })}
                >
                    <option value="">-- Selecciona --</option>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="TARJETA">TARJETA</option>
                </select>
                {errors.metodo_pago && (
                    <ErrorMessage>{errors.metodo_pago.message}</ErrorMessage>
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
