import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getDeduccionById, updateDeducion } from "../../../../api/DeduccionAPI";
import { useForm } from "react-hook-form";
import type { DeduccionFormData } from "../../../../types";
import { useEffect } from "react";
import DeduccionForm from "./DeduccionForm";
import { toast } from "react-toastify";

type EditarDeduccionProps = {
    onSuccess: () => void;
    liquidacionId: number;
}
 
export default function EditarDeduccion({ onSuccess, liquidacionId } : EditarDeduccionProps) {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const deduccionId = +queryParams.get("deduccionId")!
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['deduccion', deduccionId],
        queryFn: () => getDeduccionById(deduccionId),
        enabled: !!deduccionId
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<DeduccionFormData>()

    useEffect(() => {
        if (data) {
            reset({
                tipo: data.tipo,
                monto: +data.monto
            });
        }
    }, [data, reset]);


    const { mutate, isPending } = useMutation({
        mutationFn: updateDeducion,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Deduccion Actualizada')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }
    })

    const handleEdtiDeduccion = (formData: DeduccionFormData) => {
        const data = {
            liquidacionId,
            deduccionId,
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
                onSubmit={handleSubmit(handleEdtiDeduccion)}
            >   
                                
                <DeduccionForm errors={errors} register={register} />

                
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
