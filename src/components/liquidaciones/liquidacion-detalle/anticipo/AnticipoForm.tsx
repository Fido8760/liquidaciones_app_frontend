import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../../../ErrorMessage";
import type { AnticipoFormData } from "../../../../types";

type AnticipoFormProps = {
  errors: FieldErrors<AnticipoFormData>;
  register: UseFormRegister<AnticipoFormData>;
};

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500";

export default function AnticipoForm({ errors, register }: AnticipoFormProps) {
  return (
        <fieldset className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
            <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">
                Anticipos
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
                    required: "El monto es obligatorio",
                    valueAsNumber: true,
                    })}
                />
                {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}
                </div>

                <div>
                <label
                    htmlFor="tipo"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                    Tipo
                </label>
                <select
                    id="metodo_pago"
                    className={inputStyles}
                    {...register("tipo", {
                    required: "Elige un método de pago",
                    })}
                >
                    <option value="">-- Selecciona --</option>
                    <option value="ANTICIPO">ANTICIPO</option>
                    <option value="GIRO">GIRO</option>
                    
                </select>
                {errors.tipo && <ErrorMessage>{errors.tipo.message}</ErrorMessage>}
                </div>
            </div>
        </fieldset>
  );
}
