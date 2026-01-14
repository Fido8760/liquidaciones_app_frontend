import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAnticipoById, updateAnticipo } from "../../../../api/AnticipoAPI";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AnticipoFormData } from "../../../../types";
import AnticipoForm from "./AnticipoForm";
import { toast } from "react-toastify";

type EditarAnticipoProps = {
    onSuccess: () => void;
    liquidacionId: number;
}

export default function EditarAnticipo({ onSuccess, liquidacionId }: EditarAnticipoProps) {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const anticipoId = +queryParams.get("anticipoId")!
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['anticipo', anticipoId],
        queryFn: () => getAnticipoById(anticipoId),
        enabled: !!anticipoId
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AnticipoFormData>()

    const {mutate, isPending} = useMutation({
        mutationFn: updateAnticipo,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Anticipo Actualizado')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }
    })

    useEffect(() => {
        if (data) {
            reset({
                tipo: data.tipo,
                monto: +data.monto
            });
        }
    }, [data, reset]);


    const handleEdtiAnticipo = (formData: AnticipoFormData) => {
        const data = {
            liquidacionId,
            anticipoId,
            formData
        }
        mutate(data)
    }

    if (isLoading) return <p>Cargando...</p>


    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleEdtiAnticipo)}
            >   
                                
                <AnticipoForm errors={errors} register={register} />

                
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
