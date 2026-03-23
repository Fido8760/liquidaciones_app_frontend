import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { GastoFormData, TipoGasto } from "../../../../types";
import { CurrencyDollarIcon, DocumentTextIcon, TagIcon } from "@heroicons/react/20/solid";
import ErrorMessage from "../../../ErrorMessage";

type GastoFormProps = {
    errors: FieldErrors<GastoFormData>;
    register: UseFormRegister<GastoFormData>;
    watch: UseFormWatch<GastoFormData>;
    setValue: UseFormSetValue<GastoFormData>;
    tiposActivos: TipoGasto[];
    loadingTipos: boolean
};

const inputStyles = "w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500";

const InputIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    </div>
);

export default function GastoForm({errors, register, watch, setValue, tiposActivos, loadingTipos}: GastoFormProps) {

    const afectaOperador = watch('afecta_operador');

    return (
        <div className=" space-y-5">
            <div>
                <label className=" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Gasto</label>
                <div className=" relative">
                    <InputIcon icon={TagIcon} />
                    <select
                        className={`${inputStyles} appearance-none`}
                        {...register('tipoGastoId', {
                            required: 'El tipo de gasto es obligatorio',
                            valueAsNumber: true
                        })}
                    >
                        <option value="">-- Selecciona un tipo --</option>
                        {loadingTipos && <option disabled>Cargando...</option>}
                        {tiposActivos?.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                    </select>
                </div>
                {errors.tipoGastoId && <ErrorMessage>{errors.tipoGastoId?.message}</ErrorMessage>}
            </div>
            <div>
                <label htmlFor="monto" className=" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monto</label>
                <div className=" relative">
                    <InputIcon icon={CurrencyDollarIcon} />
                    <input 
                        id="monto"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={inputStyles}
                        {...register('monto', {
                            required: 'El monto el obligatorio',
                            valueAsNumber: true
                        })} 
                    />
                </div>
                {errors.monto && <ErrorMessage>{errors.monto.message}</ErrorMessage>}
            </div>
            <div>
                <label htmlFor="descripcion" className=" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción</label>
                <div className=" relative">
                    <InputIcon icon={DocumentTextIcon} />
                    <input 
                        id="descripcion"
                        type="text"
                        placeholder="Ej. Comida en carretera"
                        className={inputStyles}
                        {...register('descripcion', {
                            required: 'La Descripción es obligatoria',
                        })} 
                    />
                </div>
                {errors.descripcion && <ErrorMessage>{errors.descripcion.message}</ErrorMessage>}
            </div>
            <div className=" flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setValue('afecta_operador', !afectaOperador)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-transform ${afectaOperador ? 'bg-fuchsia-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${afectaOperador ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
                <label className=" text-sm font-medium text-gray-700 dark:text-gray-300">Afecta al operador</label>
                <input type="hidden" {...register('afecta_operador')} />
            </div>
            <div>
                <label className=" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Evidencia <span className=" text-gray-400 text-xs">(opcional)</span></label>
                <input 
                    type="file"
                    accept="image/*, application/pdf"
                    className=" w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:bg-fuchsia-600 file:text-white file:text-sm file:font-medium hover:file:bg-fuchsia-700 file:rounded-lg file:cursor-pointer bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 cursor-pointer" 
                    {...register('evidencia')}
                />
            </div>
        </div>
    )
}
