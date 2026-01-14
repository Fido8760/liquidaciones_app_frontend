import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LiquidacionFormData, Operadores, Unidades } from '../../types';
import FormField from './FormFields';

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all dark:bg-gray-700 dark:border-gray-600";

type LiquidacionFormProps = {
    errors: FieldErrors<LiquidacionFormData>;
    register: UseFormRegister<LiquidacionFormData>;
    unidades: Unidades; 
    operadores: Operadores;
}

export default function LiquidacionForm({ errors, register, unidades, operadores }: LiquidacionFormProps) {
    return (
        <div className="space-y-8">
            {/* GRUPO 1: DATOS GENERALES */}
            <fieldset className="p-4 border dark:border-gray-700 rounded-lg">
                <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">Información del Viaje</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                    <FormField label="Folio Liquidación" htmlFor="folio_liquidacion" error={errors.folio_liquidacion} required>
                        <input 
                        id="folio_liquidacion" 
                        type="text" 
                        inputMode="numeric"
                        className={inputStyles} 
                        placeholder="Ej. 123456"
                        {...register("folio_liquidacion", { 
                                required: "El folio es obligatorio",
                                pattern: {
                                    value:/^[0-9]+$/,
                                    message: "El folio solo puede contener números"
                                }
                            }
                        )} />
                    </FormField>

                    <FormField label="Cliente" htmlFor="cliente" error={errors.cliente} required>
                        <input id="cliente" type="text" className={inputStyles} placeholder="Nombre del cliente"
                            {...register("cliente", { required: "El nombre del cliente es obligatorio" })} />
                    </FormField>
                </div>
            </fieldset>

            {/* GRUPO 2: ASIGNACIONES */}
            <fieldset className="p-4 border dark:border-gray-700 rounded-lg">
                <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">Asignaciones</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                    <FormField label="Unidad" htmlFor="unidadId" error={errors.unidadId} required>
                        <select id="unidadId" className={inputStyles} {...register("unidadId", { required: "La unidad es obligatoria", valueAsNumber: true })}>
                            <option value="" disabled>-- Selecciona una unidad --</option>
                            {unidades.unidades.map(u => <option key={u.id} value={u.id}>{u.no_unidad} - {u.tipo_unidad}</option>)}
                        </select>
                    </FormField>

                    <FormField label="Operador" htmlFor="operadorId" error={errors.operadorId} required>
                        <select id="operadorId" className={inputStyles} {...register("operadorId", { required: "El operador es obligatorio", valueAsNumber: true })}>
                            <option value="" disabled>-- Selecciona un operador --</option>
                            {operadores.operadores.map(op => <option key={op.id} value={op.id}>{`${op.apellido_p} ${op.apellido_m} ${op.nombre}`}</option>)}
                        </select>
                    </FormField>
                </div>
            </fieldset>

            {/* GRUPO 3: FECHAS Y MÉTRICAS */}
            <fieldset className="p-4 border dark:border-gray-700 rounded-lg">
                <legend className="px-2 text-base font-semibold text-gray-800 dark:text-gray-200">Fechas y Métricas</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mt-2">
                    <FormField label="Fecha de Inicio" htmlFor="fecha_inicio" error={errors.fecha_inicio} required>
                        <input id="fecha_inicio" type="date" className={inputStyles} {...register("fecha_inicio", { required: "La fecha de inicio es obligatoria" })} />
                    </FormField>
                    
                    <FormField label="Fecha de Fin" htmlFor="fecha_fin" error={errors.fecha_fin} required>
                        <input id="fecha_fin" type="date" className={inputStyles} {...register("fecha_fin", { required: "La fecha de fin es obligatoria" })} />
                    </FormField>

                    <FormField label="Fecha de Llegada" htmlFor="fecha_llegada" error={errors.fecha_llegada} required>
                        <input id="fecha_llegada" type="date" className={inputStyles} {...register("fecha_llegada", { required: "La fecha de llegada es obligatoria" })} />
                    </FormField>
                    
                    {/* Hacemos que estos ocupen más espacio si es necesario */}
                    <FormField label="Rendimiento (Km/L)" htmlFor="rendimiento" error={errors.rendimiento} required>
                        <input id="rendimiento" type="number" step="0.01" className={inputStyles} {...register("rendimiento", { required: "El rendimiento es obligatorio", valueAsNumber: true })} />
                    </FormField>

                    <FormField label="Kilómetros Recorridos" htmlFor="kilometros_recorridos" error={errors.kilometros_recorridos} required>
                        <input id="kilometros_recorridos" type="number" className={inputStyles} {...register("kilometros_recorridos", { required: "El kilometraje es obligatorio", valueAsNumber: true })} />
                    </FormField>
                </div>
            </fieldset>
        </div>
    );
}