import { useForm } from "react-hook-form";
import CostoFleteForm from "./FleteForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FleteFormData } from "../../../../types";
import { toast } from "react-toastify";
import { createCostoflete } from "../../../../api/fletes/FleteAPI";
import SubmitButton from "../../../botones/SubmitButton";

type FleteProps = {
    onSuccess: () => void;
    liquidacionId: number;
};

export default function Flete({ onSuccess, liquidacionId }: FleteProps) {
    const queryClient = useQueryClient()
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FleteFormData>({ defaultValues : {
        monto: 0,
        descripcion: '',
        liquidacionId
    }})

    const { mutate, isPending } = useMutation({
        mutationFn: createCostoflete,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha agregado correctamente el costo del flete')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }

    })

    const handleForm = (formData: FleteFormData) => {
        mutate(formData);
    }

    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >
                
                <CostoFleteForm register={register} errors={errors} />
                <SubmitButton isPending={isPending} />
            </form>
        </>
    );
}
