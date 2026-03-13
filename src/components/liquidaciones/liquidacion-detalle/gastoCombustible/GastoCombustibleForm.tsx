import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"
import ErrorMessage from "../../../ErrorMessage"
import type { GastoCombustibleFormData } from "../../../../types"
import { CurrencyDollarIcon, FireIcon, BeakerIcon, CreditCardIcon } from "@heroicons/react/24/outline"

type GastoCombustibleFormProps = {
    errors: FieldErrors<GastoCombustibleFormData>
    register: UseFormRegister<GastoCombustibleFormData>
    watch: UseFormWatch<GastoCombustibleFormData>
}

const inputStyles = "w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"

const InputIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    </div>
);

export default function GastoCombustibleForm({ errors, register, watch }: GastoCombustibleFormProps) {

    const monto = watch("monto");
    const precioLitro = watch("precio_litro");
    const litrosCalculados = monto && precioLitro && precioLitro > 0
        ? +(monto / precioLitro).toFixed(2)
        : 0;

    return (
        <div className="space-y-5">

            {/* Monto y Precio litro */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Monto total
                    </label>
                    <div className="relative">
                        <InputIcon icon={CurrencyDollarIcon} />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ej. 3500.00"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Precio por litro
                    </label>
                    <div className="relative">
                        <InputIcon icon={FireIcon} />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ej. 24.50"
                            className={inputStyles}
                            {...register("precio_litro", {
                                required: "El precio por litro es obligatorio",
                                valueAsNumber: true,
                            })}
                        />
                    </div>
                    {errors.precio_litro && <ErrorMessage>{errors.precio_litro.message}</ErrorMessage>}
                </div>
            </div>

            {/* Litros calculados y Método de pago */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Litros estimados
                    </label>
                    <div className="relative">
                        <InputIcon icon={BeakerIcon} />
                        <input
                            type="number"
                            value={litrosCalculados}
                            readOnly
                            className={`${inputStyles} bg-gray-100 dark:bg-gray-600/50 cursor-not-allowed text-gray-400 dark:text-gray-400`}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calculado automáticamente</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Método de pago
                    </label>
                    <div className="relative">
                        <InputIcon icon={CreditCardIcon} />
                        <select
                            className={`${inputStyles} appearance-none`}
                            {...register("metodo_pago", {
                                required: "Elige un método de pago",
                            })}
                        >
                            <option value="">-- Selecciona --</option>
                            <option value="EFECTIVO">EFECTIVO</option>
                            <option value="TARJETA">TARJETA</option>
                        </select>
                    </div>
                    {errors.metodo_pago && <ErrorMessage>{errors.metodo_pago.message}</ErrorMessage>}
                </div>
            </div>

            {/* Evidencia */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Evidencia <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:border-0 file:rounded-lg
                        file:bg-fuchsia-600 file:text-white file:text-sm file:font-medium
                        hover:file:bg-fuchsia-700 file:cursor-pointer
                        bg-gray-700/50 border border-gray-600
                        rounded-lg px-3 py-1.5 cursor-pointer"
                    {...register("evidencia")}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, PNG o JPG — máx. 5MB</p>
                {errors.evidencia && <ErrorMessage>{errors.evidencia.message}</ErrorMessage>}
            </div>

        </div>
    );
}