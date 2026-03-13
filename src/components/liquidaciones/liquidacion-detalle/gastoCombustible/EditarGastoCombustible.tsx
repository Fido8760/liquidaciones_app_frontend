import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCombustiblebyId, updateCombustible } from "../../../../api/combustible/CombustibleAPI";
import GastoCombustibleForm from "./GastoCombustibleForm";
import { useForm } from "react-hook-form";
import type { GastoCombustibleFormData } from "../../../../types";
import { useEffect } from "react";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';

type EditarGastoCombustibleProps = {
    onSuccess: () => void;
    liquidacionId: number
};

export default function EditarGastoCombustible({ onSuccess, liquidacionId }: EditarGastoCombustibleProps) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const combustibleId = +queryParams.get("combustibleId")!;
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["combustible", combustibleId],
        queryFn: () => getCombustiblebyId(combustibleId),
        enabled: !!combustibleId,
    });

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GastoCombustibleFormData>();

    useEffect(() => {
        if (data) {
            reset({
                precio_litro: +data.precio_litro,
                monto: +data.monto,
                metodo_pago: data.metodo_pago,
                evidencia: undefined 
            });
        }
    }, [data, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateCombustible,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Combustible Actualizado')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            reset();

        }
    })

    const handleEdtiCombustible = async (formData: GastoCombustibleFormData) => {
        const dataToSend = new FormData();
        dataToSend.append('monto', String(formData.monto));
        dataToSend.append('precio_litro', String(formData.precio_litro));
        dataToSend.append('metodo_pago', String(formData.metodo_pago));

        if(formData.evidencia && formData.evidencia.length > 0) {
            const file = formData.evidencia[0];
            if (file.type.startsWith('image/')) {
                const compressed = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    fileType: 'image/webp'
                });
                dataToSend.append('file', new File([compressed], 'evidencia.webp', { type: 'image/webp' }));
            } else {
                dataToSend.append('file', file);
            }
        }

        mutate({combustibleId, formData: dataToSend});
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
            <svg className="animate-spin h-8 w-8 text-fuchsia-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando datos...</p>
        </div>
    );

    return (
        <form 
            className="mt-10 space-y-10" 
            noValidate 
            onSubmit={handleSubmit(handleEdtiCombustible)}>
            <GastoCombustibleForm errors={errors} register={register} watch={watch} />

            {data?.evidencia && (
                <p className="text-sm text-gray-600">
                    Archivo actual: <a href={data.evidencia} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.evidencia}</a>
                </p>
            )}

            <input
                type="submit"
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                value={isPending ? 'Actualizando...' : 'Actualizar'}
                disabled={isPending}
            />
        </form>
    );
}
