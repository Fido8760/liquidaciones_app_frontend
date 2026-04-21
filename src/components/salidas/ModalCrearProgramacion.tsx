import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProgramacionSalidaForm, TipoUnidadRequerido, Unidad } from "../../types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { crearProgramacion } from "../../api/salidas/ProgramacionSalidas";
import FormularioProgramacion from "./FormularioProgramacion";
import { getTodayLocalDate } from "../../utils/getLocalDate";

type ModalCrearProgramacionProps = {
    isOpen: boolean;
    onClose: () => void;
    unidades: Unidad[]
}

const today = getTodayLocalDate();

const initialValues: CreateProgramacionSalidaForm = {
    unidadId: undefined,
    tipo_unidad_solicitado: 'TRACTOCAMION' as TipoUnidadRequerido,
    cliente: '',
    destino: '',
    fecha_salida: today,
    fecha_carga: today,
    hora_carga: '',
    fecha_descarga: '',
    hora_descarga: '',
    observaciones: '',
};

export default function ModalCrearProgramacion({ isOpen, onClose, unidades }: ModalCrearProgramacionProps) {
    
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateProgramacionSalidaForm>({
        defaultValues: initialValues
    });

    const { mutate, isPending } = useMutation({
        mutationFn: crearProgramacion,
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Programación creada correctamente');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas', 'dia'] });
            reset(initialValues);
            onClose();
        }
    });

    const handleForm = (data: CreateProgramacionSalidaForm) => {
        mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">
                        Nueva Programación de Salida
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form noValidate onSubmit={handleSubmit(handleForm)} className="p-5">
                    <FormularioProgramacion 
                        register={register} 
                        errors={errors} 
                        isPending={isPending}
                        watch={watch}
                        isEdit={false}
                        unidades={unidades}
                    />
                </form>
            </div>
        </div>
    );
}
