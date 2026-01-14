import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCostoFleteById, updateFlete } from "../../../../api/FleteAPI";
import { useForm } from "react-hook-form";
import type { CostoFleteFormData } from "../../../../types";
import { useEffect } from "react";
import CostoFleteForm from "./CostoFleteForm";
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

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CostoFleteFormData>()

    useEffect(() => {
        if (data) {
            reset({
                monto: +data.monto,
                descripcion: data.descripcion,
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

    const handleEdtiFlete = (formData: CostoFleteFormData) => {
        const data = {
            liquidacionId,
            costoId,
            formData
        }
        mutate(data)
    }

    if (isLoading) return <p>Cargando...</p>;

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
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                    value={isPending ? 'Actualizando...' : 'Actualizar'}
                    disabled={isPending}       
                />
            </form>
        </>
    )
}
