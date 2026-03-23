import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getGastoById, getTipoGastosActivos, updateGsto } from "../../../../api/gastos/GastoAPI";
import { useForm } from "react-hook-form";
import type { GastoFormData } from "../../../../types";
import { useEffect } from "react";
import GastoForm from "./GastoForm";
import { toast } from "react-toastify";
import { prepararArchivo } from "../../../../utils/prepararArchivo";
import SubmitButton from "../../../botones/SubmitButton";

type EditarGastoProps = {
    onSuccess: () => void;
    liquidacionId: number
};
export default function EditarGasto({onSuccess, liquidacionId}: EditarGastoProps) {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const gastoId = +queryParams.get("gastoId")!;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["gasto", gastoId],
        queryFn: () => getGastoById(gastoId),
        enabled: !!gastoId
    });

    const { data: tiposActivos, isLoading: loadingTipos  } = useQuery({
        queryKey: ['tipo-gastos-activos'],
        queryFn: getTipoGastosActivos,
    });


    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<GastoFormData>();

    useEffect(() => {
        if(data) {
            reset({
                tipoGastoId: +data.tipo_gasto.id,
                monto: +data.monto,
                descripcion: data.descripcion ?? '',
                afecta_operador: data.afecta_operador,
                evidencia: undefined
            })
        }
    }, [data, tiposActivos,reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateGsto,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Gasto Actualizado');
            onSuccess();
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            reset();
        }
    })

    const handleEditGasto = async (formData: GastoFormData) => {
        const dataToSend = new FormData();
        dataToSend.append('monto', String(formData.monto));
        dataToSend.append('tipoGastoId', String(formData.tipoGastoId));
        dataToSend.append('descripcion', String(formData.descripcion));
        dataToSend.append('afecta_operador', String(formData.afecta_operador));

        if(formData.evidencia) {
            const archivo = await prepararArchivo(formData.evidencia);
            if(archivo) dataToSend.append('file', archivo);
        }
        mutate({gastoId, formData: dataToSend})
    }

    if (isLoading || loadingTipos ) return (
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
            onSubmit={handleSubmit(handleEditGasto)}
        >
            <GastoForm errors={errors} register={register} watch={watch} setValue={setValue} tiposActivos={tiposActivos ?? []} loadingTipos={loadingTipos} />
            {data?.evidencia && data.evidencia !== 'default.pdf' && (
                <p className=" text-sm text-gray-600">
                    Archivo Actual: <a href={data.evidencia} target="_blank" rel="noopener noreferrer" className=" text-blue-600 underline">{data.evidencia}</a>
                </p>
            )}

            <SubmitButton isPending={isPending} label="Actualizar" pendingLabel="Actualizando..." />

        </form>
    )
}
