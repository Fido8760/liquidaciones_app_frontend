import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../../../ErrorMessage";
import type { AnticipoFormData } from "../../../../types";
import { CurrencyDollarIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";

type AnticipoFormProps = {
  errors: FieldErrors<AnticipoFormData>;
  register: UseFormRegister<AnticipoFormData>;
};

const inputStyles = "w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"

const InputIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    </div>
);

export default function AnticipoForm({ errors, register }: AnticipoFormProps) {
    return (
        <div className=" space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="monto"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        Monto
                    </label>
                    <div className="relative">
                        <InputIcon icon={CurrencyDollarIcon}/>
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
                    </div>
                    {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}
                </div>

                <div>
                    <label
                        htmlFor="tipo"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        Tipo
                    </label>
                    <div className="relative">
                        <InputIcon icon={ShieldCheckIcon}/>
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
                    </div>
                    {errors.tipo && <ErrorMessage>{errors.tipo.message}</ErrorMessage>}
                </div>
            </div>
        </div>

    );
}
