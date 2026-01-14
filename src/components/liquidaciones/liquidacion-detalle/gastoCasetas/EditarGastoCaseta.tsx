import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCasetaById, updateCaseta } from "../../../../api/CasetaAPI";
import type { GastoCasetaFormData } from "../../../../types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import GastoCasetaForm from "./GastoCasetaForm";
import { toast } from "react-toastify";

type EditarGastoCasetaProps = {
    onSuccess: () => void;
    liquidacionId: number
}

export default function EditarGastoCaseta({ onSuccess, liquidacionId} : EditarGastoCasetaProps) {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const casetaId = +queryParams.get("casetaId")!;
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["caseta", casetaId],
        queryFn: () => getCasetaById(casetaId),
        enabled: !!casetaId
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<GastoCasetaFormData>();
    
    useEffect(() => {
        if (data) {
            reset({
                monto: +data.monto,
                metodo_pago_caseta: data.metodo_pago_caseta,
                evidencia: undefined 
            });
        }
    }, [data, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateCaseta,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Gasto de Casetas Actualizado')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            reset();
        }
    })

    const handleEdtiCombustible = (formData: GastoCasetaFormData) => {
        const data = {
            liquidacionId,
            casetaId,
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
                onSubmit={handleSubmit(handleEdtiCombustible)}
            >   
                        
                <GastoCasetaForm errors={errors} register={register} />

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
