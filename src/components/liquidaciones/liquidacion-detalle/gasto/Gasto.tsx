import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GastoFormData } from "../../../../types";
import GastoForm from "./GastoForm";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createGasto, getTipoGastosActivos } from "../../../../api/gastos/GastoAPI";
import { prepararArchivo } from "../../../../utils/prepararArchivo";
import SubmitButton from "../../../botones/SubmitButton";


type GastoProps = {
  onSuccess: () => void;
  liquidacionId: number;
};

export default function Gasto({liquidacionId, onSuccess}: GastoProps) {
    const queryClient = useQueryClient();
    const intialValues: Partial<GastoFormData> = {
        monto: 0,
        afecta_operador: false
    };

    const { data: tiposActivos, isLoading: loadingTipos } = useQuery({
        queryKey: ['tipo-gastos-activos'],
        queryFn: getTipoGastosActivos,
    });

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<GastoFormData>({
        defaultValues: intialValues
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createGasto,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Gasto agregado correctamente');
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            onSuccess();
            reset();
        }
    })

    const handleForm = async (data: GastoFormData) => {
        console.log(data)
        const formPayload = new FormData();
        formPayload.append('tipoGastoId', String(data.tipoGastoId));
        formPayload.append('monto', String(data.monto));
        formPayload.append('liquidacionId', String(liquidacionId));
        if(data.afecta_operador) {
            formPayload.append('afecta_operador', 'true')
        }

        if(data.descripcion) formPayload.append('descripcion', data.descripcion);

        if(data.evidencia) {
            const archivo = await prepararArchivo(data.evidencia);
            if(archivo) formPayload.append('file', archivo);
        }

            for (const [key, value] of formPayload.entries()) {
                console.log(`${key}:`, value);
            }


        mutate(formPayload);
    }
    return (
        <>
            <form 
                className=" mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >
                <GastoForm errors={errors} register={register} watch={watch} setValue={setValue} tiposActivos={tiposActivos ?? []} loadingTipos={loadingTipos}/>
                <SubmitButton isPending={isPending} />
            </form>
        </>
    )
}
