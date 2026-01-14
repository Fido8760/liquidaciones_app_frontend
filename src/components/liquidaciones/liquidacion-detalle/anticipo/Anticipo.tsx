import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import AnticipoForm from "./AnticipoForm";
import type { AnticipoFormData } from "../../../../types";
import { createAnticipo } from "../../../../api/AnticipoAPI";
import { toast } from "react-toastify";

type AnticipoProps = {
  onSuccess: () => void;
  liquidacionId: number;
};

export default function Anticipo({ onSuccess, liquidacionId }: AnticipoProps) {

    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AnticipoFormData>({ defaultValues: {
        monto: 0,
        tipo: 'ANTICIPO',
        liquidacionId
    }})
    const { mutate, isPending} = useMutation({
        mutationFn: createAnticipo,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha agregado correctamente el anticipo')
            onSuccess()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            reset()
        }
    })
    const handleForm = (formData: AnticipoFormData) => {
        mutate(formData)
    }
    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >
                <AnticipoForm errors={errors} register={register} />
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
