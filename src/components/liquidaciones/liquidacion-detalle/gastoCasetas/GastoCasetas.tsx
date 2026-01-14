import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from 'browser-image-compression';
import type { GastoCasetaFormData } from "../../../../types";
import GastoCasetaForm from "./GastoCasetaForm";
import { createGastoCaseta } from "../../../../api/CasetaAPI";

type GastoCasetasProps = {
    onSuccess: () => void;
    liquidacionId: number;
}

export default function GastoCasetas({ onSuccess, liquidacionId }: GastoCasetasProps) {
    
    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<GastoCasetaFormData>({ defaultValues: {
        monto: 0,
        metodo_pago_caseta: 'IAVE/TAG',
    }});

    const {mutate, isPending} = useMutation({
        mutationFn: createGastoCaseta,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha agregado')
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] });
            onSuccess();
            reset();
        }
    })
    
    const handleForm = async (dataFromHook: GastoCasetaFormData) => {
        const formPayload  = new FormData()
        formPayload.append('monto', String(dataFromHook.monto));
        formPayload.append('metodo_pago_caseta', dataFromHook.metodo_pago_caseta);
        formPayload.append('liquidacionId', String(liquidacionId));
        
        if(dataFromHook.evidencia && dataFromHook.evidencia.length > 0) {
            const imageFile = dataFromHook.evidencia[0]
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: 'image/webp'
            })
        
            const webpFile = new File([compressedFile], 'evidencia.webp', { type: 'image/webp' })
            formPayload.append('file', webpFile)
        }

        mutate(formPayload)
    }
    return (
        <>
            <form
                className="mt-10 space-y-10"
                noValidate
                onSubmit={handleSubmit(handleForm)}
            >   
                <GastoCasetaForm register={register} errors={errors} />

                <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                    value={isPending ? 'Guardando...' : 'Agregar'}
                    disabled={isPending}
                />
            </form>
        </>
    );
}
