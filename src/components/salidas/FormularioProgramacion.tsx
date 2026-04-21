import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { CreateProgramacionSalidaForm, Unidad } from "../../types";
import ErrorMessage from "../ErrorMessage";

type FormularioProgramacionProps = {
    register: UseFormRegister<CreateProgramacionSalidaForm>;
    errors: FieldErrors<CreateProgramacionSalidaForm>;
    isPending: boolean;
    isEdit?:boolean;
    watch: UseFormWatch<CreateProgramacionSalidaForm>;
    unidades: Unidad[];
}

const inputStyles = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export default function FormularioProgramacion({ register, errors, isPending, isEdit, watch, unidades }: FormularioProgramacionProps) {

    const tipoSolicitado = watch('tipo_unidad_solicitado');
    const unidadesFiltradas = (unidades ?? []).filter(u => u.tipo_unidad === tipoSolicitado);

    return (
        <div className="space-y-4">

            {/* UNIDAD */}
            <div>
                <label className={labelStyles}>Tipo Unidad Requerida <span className="text-red-500">*</span></label>
                <select
                    {...register('tipo_unidad_solicitado', {
                        required: 'el tipo de unidad es obligatoria',
                    })}
                    className={`${inputStyles} appearance-none`}
                    disabled={isEdit}
                >
                    <option value="">Selecciona un tipo</option>
                    <option value="TRACTOCAMION">Tractocamión</option>
                    <option value="MUDANCERO">Mudancero</option>
                    <option value="CAMIONETA">Camioneta</option>
                </select>
                {errors.tipo_unidad_solicitado && <ErrorMessage>{errors.tipo_unidad_solicitado.message}</ErrorMessage>}
            </div>
            
            {isEdit && (
                <div>
                    <label className={labelStyles}>Asignar Unidad <span className="text-gray-400 text-xs">(opcional)</span></label>
                    <select
                        {...register('unidadId', { 
                            setValueAs: (v) => v === '' ? undefined : Number(v)
                        })}
                        className={`${inputStyles} appearance-none border-blue-300 bg-blue-50 dark:bg-blue-900/20`}
                    >
                        <option value="">-- Sin Asignar --</option>
                        {unidadesFiltradas.map(u => (
                            <option key={u.id} value={u.id}>{u.no_unidad} - {u.tipo_unidad}</option>
                        ))}
                    </select>
                    {tipoSolicitado && unidadesFiltradas.length === 0 && (
                        <ErrorMessage>No hay unidades disponibles del tipo {tipoSolicitado}</ErrorMessage>
                    )}
                </div>
            )}
            {/* CLIENTE */}
            <div>
                <label className={labelStyles}>Cliente <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder="Nombre del cliente"
                    {...register('cliente', { required: 'El cliente es obligatorio' })}
                    className={inputStyles}
                />
                {errors.cliente && <ErrorMessage>{errors.cliente.message}</ErrorMessage>}
            </div>

            {/* DESTINO */}
            <div>
                <label className={labelStyles}>Destino <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder="Ciudad, Estado"
                    {...register('destino', { required: 'El destino es obligatorio' })}
                    className={inputStyles}
                />
                {errors.destino && <ErrorMessage>{errors.destino.message}</ErrorMessage>}
            </div>

            {/* FECHA SALIDA */}
            <div>
                <label className={labelStyles}>Fecha de Salida <span className="text-red-500">*</span></label>
                <input
                    type="date"
                    {...register('fecha_salida', { required: 'La fecha de salida es obligatoria' })}
                    className={inputStyles}
                />
                {errors.fecha_salida && <ErrorMessage>{errors.fecha_salida.message}</ErrorMessage>}
            </div>

            {/* FECHA Y HORA CARGA */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyles}>Fecha de Carga <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        {...register('fecha_carga', { 
                            required: 'La fecha de carga es obligatoria',
                            validate: (value, formValue) => {
                                if(value < formValue.fecha_salida) return 'Lafecha de carga no puede ser menor a la fecha de salida'
                            }
                        })}
                        className={inputStyles}
                    />
                    {errors.fecha_carga && <ErrorMessage>{errors.fecha_carga.message}</ErrorMessage>}
                </div>
                <div>
                    <label className={labelStyles}>Hora de Carga <span className="text-red-500">*</span></label>
                    <input
                        type="time"
                        {...register('hora_carga', { required: 'La hora de carga es obligatoria' })}
                        className={inputStyles}
                    />
                    {errors.hora_carga && <ErrorMessage>{errors.hora_carga.message}</ErrorMessage>}
                </div>
            </div>

            {/* FECHA Y HORA DESCARGA */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyles}>Fecha de Descarga <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        {...register('fecha_descarga', { 
                            required: 'La fecha de descarga es obligatoria',
                            validate: (value, formValue) => {
                                if(value < formValue.fecha_salida) return 'Lafecha de descarga no puede ser menor a la fecha de carga'
                            }
                        })}
                        className={inputStyles}
                    />
                    {errors.fecha_descarga && <ErrorMessage>{errors.fecha_descarga.message}</ErrorMessage>}
                </div>
                <div>
                    <label className={labelStyles}>Hora de Descarga <span className="text-red-500">*</span></label>
                    <input
                        type="time"
                        {...register('hora_descarga', { required: 'La hora de descarga es obligatoria' })}
                        className={inputStyles}
                    />
                    {errors.hora_descarga && <ErrorMessage>{errors.hora_descarga.message}</ErrorMessage>}
                </div>
            </div>

            {/* OBSERVACIONES */}
            <div>
                <label className={labelStyles}>
                    Observaciones <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <textarea
                    rows={3}
                    placeholder="Notas adicionales..."
                    {...register('observaciones')}
                    className={`${inputStyles} resize-none`}
                />
            </div>

            {/* SUBMIT */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm mt-2"
            >
                {isPending ? 'Guardando...' : 'Guardar Programación'}
            </button>
        </div>
    );
}