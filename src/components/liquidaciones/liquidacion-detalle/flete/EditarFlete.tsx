import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCostoFleteById, updateFlete } from "../../../../api/fletes/FleteAPI";
import { useForm } from "react-hook-form";
import type { FleteFormData } from "../../../../types";
import { useEffect } from "react";
import CostoFleteForm from "./FleteForm";
import { toast } from "react-toastify";

type EditarCostoFleteProps = {
    liquidacionId: number
    onSuccess: () => void
}

export default function EditarCostoFlete({ onSuccess, liquidacionId } : EditarCostoFleteProps) {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const costoId = +queryParams.get("costoId")!

    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['costoFlete', costoId],
        queryFn: () => getCostoFleteById(costoId),
        enabled: !!costoId
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FleteFormData>()

    useEffect(() => {
        if (data) {
            reset({
                monto: +data.monto,
                descripcion: data.descripcion,
                cliente: data.cliente,
                origen: data.origen,
                destino: data.destino
            });
        }
    }, [data, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateFlete,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Costo del flete actualizado')
            onSuccess(),
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }
    })

    const handleEdtiFlete = (formData: FleteFormData) => {
        const data = {
            liquidacionId,
            costoId,
            formData
        }
        mutate(data)
    }

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
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleEdtiFlete)}
            >   
                                
                <CostoFleteForm errors={errors} register={register} />

                
                <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400 rounded-md"
                    value={isPending ? 'Actualizando...' : 'Actualizar'}
                    disabled={isPending}       
                />
            </form>
        </>
    )
}
