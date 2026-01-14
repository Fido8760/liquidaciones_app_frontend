import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getVariosById, updateVarios } from "../../../../api/VariosAPI";
import GastoVariosForm from "./GastoVariosForm";
import { useForm } from "react-hook-form";
import type { GastoVarioFormData } from "../../../../types";
import { useEffect } from "react";
import { toast } from "react-toastify";

type EditarGastoVariosProps = {
    onSuccess: () => void;
    liquidacionId: number
}

export default function EditarGastoVarios({ onSuccess, liquidacionId }: EditarGastoVariosProps ) {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const variosId = +queryParams.get("variosId")!;
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["varios", variosId],
        queryFn: () => getVariosById(variosId),
        enabled: !!variosId
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<GastoVarioFormData>();

    useEffect(() => {
            if (data) {
                reset({
                    monto: +data.monto,
                    concepto: data.concepto,
                    observaciones: data.observaciones,
                    evidencia: undefined 
                });
            }
        }, [data, reset]);
    const { mutate, isPending} = useMutation({
        mutationFn: updateVarios,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha actualizado el gasto')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] })
            reset()
        }

    })

    const handleEditVarios = (formData: GastoVarioFormData) => {
        const data = {
            liquidacionId,
            variosId,
            formData
        }

        mutate(data)
    }


    if (isLoading) return <p>Cargando...</p>;

    if(data) return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleEditVarios)}
            >   
                <GastoVariosForm errors={errors} register={register} />
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
        </>
    )
}
