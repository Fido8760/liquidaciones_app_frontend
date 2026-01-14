import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeduccionForm from "./DeduccionForm";
import { useForm } from "react-hook-form";
import type { DeduccionFormData } from "../../../../types";
import { createDeduccion } from "../../../../api/DeduccionAPI";
import { toast } from "react-toastify";

type DeduccionProps = {
    onSuccess: () => void;
    liquidacionId: number;
};


export default function Deduccion({ onSuccess, liquidacionId } : DeduccionProps) {

    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: {errors}, reset} = useForm<DeduccionFormData>({ defaultValues: {
        tipo: 'ESTADIAS',
        monto: 0,
        liquidacionId
    }})

    const { mutate, isPending} = useMutation({
        mutationFn: createDeduccion,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha agregado correctamente la deducción')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }
    })

    const handleForm = (formData: DeduccionFormData) => {
        mutate(formData)
    }

    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >
                        
                <DeduccionForm errors={errors} register={register} />
                <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                    value={isPending ? "Guardando..." : "Agregar"}
                    disabled={isPending}
                />
            </form>
        </>
    )
}
