import { useForm } from "react-hook-form";
import type { GastoCombustible, GastoCombustibleFormData } from "../../../../types"; 
import GastoCombustibleForm from "./GastoCombustibleForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGastoCombustible } from "../../../../api/CombustibleAPI";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';

type GastoCombustibleProps = {
    onSuccess: () => void;
    liquidacionId: number;
};

export default function GastoCombustible({ onSuccess, liquidacionId }: GastoCombustibleProps) {
    const initialValues: Partial<GastoCombustibleFormData> = {
        litros: 0,
        precio_litro: 0,
        monto: 0,
        metodo_pago: 'TARJETA',
    };
    
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<GastoCombustibleFormData>({ defaultValues: initialValues });

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

    const handleForm = async (dataFromHook: GastoCombustibleFormData) => {

        const formPayload  = new FormData()

        formPayload.append('litros', String(dataFromHook.litros));
        formPayload.append('precio_litro', String(dataFromHook.precio_litro));
        formPayload.append('monto', String(dataFromHook.monto));
        formPayload.append('metodo_pago', dataFromHook.metodo_pago);
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
                <GastoCombustibleForm errors={errors} register={register} watch={watch} setValue={setValue}/>

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