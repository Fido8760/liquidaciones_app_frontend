import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCombustiblebyId, updateCombustible } from "../../../../api/CombustibleAPI";
import GastoCombustibleForm from "./GastoCombustibleForm";
import { useForm } from "react-hook-form";
import type { GastoCombustibleFormData } from "../../../../types";
import { useEffect } from "react";
import { toast } from "react-toastify";

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

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<GastoCombustibleFormData>();

    useEffect(() => {
        if (data) {
            reset({
                litros: +data.litros,
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

    const handleEdtiCombustible = (formData: GastoCombustibleFormData) => {
        const data = {
            liquidacionId,
            combustibleId,
            formData
        }

        mutate(data)
    };

    if (isLoading) return <p>Cargando...</p>;

    return (
        <form 
            className="mt-10 space-y-10" 
            noValidate 
            onSubmit={handleSubmit(handleEdtiCombustible)}>
            <GastoCombustibleForm errors={errors} register={register} watch={watch} setValue={setValue} />

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
