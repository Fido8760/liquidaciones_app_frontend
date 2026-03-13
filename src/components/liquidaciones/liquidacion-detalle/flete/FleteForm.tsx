import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../../../ErrorMessage";
import type { FleteFormData } from "../../../../types";
import { CurrencyDollarIcon, MapIcon, MapPinIcon, UserIcon, DocumentTextIcon } from "@heroicons/react/20/solid";

type CostoFleteFormProps = {
    register: UseFormRegister<FleteFormData>
    errors:  FieldErrors<FleteFormData>
}

const inputStyles = "w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
const InputIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-800 dark:text-gray-500" />
    </div>
);
export default function CostoFleteForm({ register, errors }: CostoFleteFormProps) {
    return (
        <div className=" space-y-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto</label>
            <div className=" relative">
                <InputIcon icon={CurrencyDollarIcon} />
                <input 
                    type="number" 
                    step={"0.01"}
                    placeholder="0.00"
                    className={inputStyles}
                    {...register("monto", {
                        required: "El monto es obligatorio",
                        valueAsNumber: true,
                    })}
                />
            </div>
            {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}

            {/* Cliente */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Cliente
                </label>
                <div className="relative">
                    <InputIcon icon={UserIcon} />
                    <input
                        type="text"
                        placeholder="Ej. Koblenz"
                        className={inputStyles}
                        {...register("cliente", {
                            required: "El cliente es obligatorio",
                        })}
                    />
                </div>
                {errors.cliente && <ErrorMessage>{errors.cliente.message}</ErrorMessage>}
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Descripción <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Folio bitácora, notas)</span>
                </label>
                <div className="relative">
                    <InputIcon icon={DocumentTextIcon} />
                    <input
                        type="text"
                        placeholder="Ej. Bitácora 65124"
                        className={inputStyles}
                        {...register("descripcion")}
                    />
                </div>
                {errors.descripcion && <ErrorMessage>{errors.descripcion.message}</ErrorMessage>}
            </div>

             {/* Origen y Destino */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Origen
                    </label>
                    <div className="relative">
                        <InputIcon icon={MapPinIcon} />
                        <input
                            type="text"
                            placeholder="Ej. CDMX"
                            className={inputStyles}
                            {...register("origen", {
                                required: "El origen es obligatorio",
                            })}
                        />
                    </div>
                    {errors.origen && <ErrorMessage>{errors.origen.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Destino
                    </label>
                    <div className="relative">
                        <InputIcon icon={MapIcon} />
                        <input
                            type="text"
                            placeholder="Ej. Monterrey"
                            className={inputStyles}
                            {...register("destino", {
                                required: "El destino es obligatorio",
                            })}
                        />
                    </div>
                    {errors.destino && <ErrorMessage>{errors.destino.message}</ErrorMessage>}
                </div>
            </div>
        </div>
        
    )
}

