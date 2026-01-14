import { useForm } from "react-hook-form";
import CostoFleteForm from "./CostoFleteForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CostoFleteFormData } from "../../../../types";
import { toast } from "react-toastify";
import { createCostoflete } from "../../../../api/FleteAPI";

type CostoFleteProps = {
    onSuccess: () => void;
    liquidacionId: number;
};

export default function CostoFlete({ onSuccess, liquidacionId }: CostoFleteProps) {
    const queryClient = useQueryClient()
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CostoFleteFormData>({ defaultValues : {
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

    const handleForm = (formData: CostoFleteFormData) => {
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
                <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                    value={isPending ? "Guardando..." : "Agregar"}
                    disabled={isPending}
                />
            </form>
        </>
    );
}
