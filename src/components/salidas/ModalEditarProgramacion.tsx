import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getProgramacionSalida, editarProgramacion } from "../../api/salidas/ProgramacionSalidas";
import FormularioProgramacion from "./FormularioProgramacion";
import LoadingSpinner from "../ui/LoadingSpinner";
import type { CreateProgramacionSalidaForm, Unidad, UpdateProgramacionSalidaForm } from "../../types";
import { useEffect, useState } from "react";

type ModalEditarProgramacionProps = {
    isOpen: boolean;
    onClose: () => void;
    salidaId: number | null;
    unidades: Unidad[];
};

export default function ModalEditarProgramacion({ isOpen, onClose, salidaId, unidades }: ModalEditarProgramacionProps) {
    const queryClient = useQueryClient();
    const [formReady, setFormReady] = useState(false);

    const { data: salida, isLoading } = useQuery({
        queryKey: ['programacion-salidas', salidaId, 'dia'],
        queryFn: () => getProgramacionSalida(salidaId!),
        enabled: !!salidaId && isOpen,
        staleTime: 0,
    });

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateProgramacionSalidaForm>();

    useEffect(() => {
        if (salida) {
            reset({
                unidadId: salida.unidad?.id,
                tipo_unidad_solicitado: salida.tipo_unidad_solicitado,
                cliente: salida.cliente,
                destino: salida.destino,
                fecha_salida: salida.fecha_salida,
                fecha_carga: salida.fecha_carga,
                hora_carga: salida.hora_carga.slice(0, 5),
                fecha_descarga: salida.fecha_descarga,
                hora_descarga: salida.hora_descarga.slice(0, 5),
                observaciones: salida.observaciones ?? '',
            });
            setFormReady(true);
        } else {
            setFormReady(false);
        }
    }, [salida, salidaId]);

    const { mutate, isPending } = useMutation({
        mutationFn: (dto: UpdateProgramacionSalidaForm) => editarProgramacion({ id: salidaId!, dto }),
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Programación actualizada correctamente');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas'] });
            reset();
            onClose();
        },
    });

    const handleForm = (data: UpdateProgramacionSalidaForm) => {
        mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200">
                        Editar Programación de Salida
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

                {/* BODY */}
                <div className="p-5">
                    {isLoading || !salida || !formReady ? (
                        <LoadingSpinner mensaje="Cargando datos..." />
                    ) : (
                        <form noValidate onSubmit={handleSubmit(handleForm)}>
                            <FormularioProgramacion
                                register={register}
                                errors={errors}
                                isPending={isPending}
                                watch={watch}
                                isEdit={true}
                                unidades={unidades}
                            />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}