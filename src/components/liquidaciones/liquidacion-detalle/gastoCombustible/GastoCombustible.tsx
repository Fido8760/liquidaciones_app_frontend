import { useForm } from "react-hook-form";
import type { GastoCombustible, GastoCombustibleFormData } from "../../../../types"; 
import GastoCombustibleForm from "./GastoCombustibleForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGastoCombustible } from "../../../../api/combustible/CombustibleAPI";
import { toast } from "react-toastify";
import SubmitButton from "../../../botones/SubmitButton";
import { prepararArchivo } from "../../../../utils/prepararArchivo";

type GastoCombustibleProps = {
    onSuccess: () => void;
    liquidacionId: number;
};

export default function GastoCombustible({ onSuccess, liquidacionId }: GastoCombustibleProps) {
    const initialValues: Partial<GastoCombustibleFormData> = {
        precio_litro: 0,
        monto: 0,
        metodo_pago: 'TARJETA',
    };
    
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<GastoCombustibleFormData>({ defaultValues: initialValues });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<GastoCombustible, Error, FormData>({
        mutationFn: createGastoCombustible,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Gasto agregado correctamente");
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            onSuccess();
            reset();
        }
    });

    const handleForm = async (formData: GastoCombustibleFormData) => {

        const dataToSend  = new FormData()
        dataToSend.append('precio_litro', String(formData.precio_litro));
        dataToSend.append('monto', String(formData.monto));
        dataToSend.append('metodo_pago', formData.metodo_pago);
        dataToSend.append('liquidacionId', String(liquidacionId));

        if(formData.evidencia) {
            const archivo = await prepararArchivo(formData.evidencia);
            if(archivo) dataToSend.append('file', archivo);    
        }

        mutate(dataToSend)

    }

    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >   
                <GastoCombustibleForm errors={errors} register={register} watch={watch}/>

                <SubmitButton isPending={isPending} />
            </form>
        </>
    );
}