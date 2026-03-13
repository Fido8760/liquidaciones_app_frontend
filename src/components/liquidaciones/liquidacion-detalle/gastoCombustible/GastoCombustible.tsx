import { useForm } from "react-hook-form";
import type { GastoCombustible, GastoCombustibleFormData } from "../../../../types"; 
import GastoCombustibleForm from "./GastoCombustibleForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGastoCombustible } from "../../../../api/combustible/CombustibleAPI";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';

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

    const handleForm = async (dataFromHook: GastoCombustibleFormData) => {

        const formPayload  = new FormData()
        formPayload.append('precio_litro', String(dataFromHook.precio_litro));
        formPayload.append('monto', String(dataFromHook.monto));
        formPayload.append('metodo_pago', dataFromHook.metodo_pago);
        formPayload.append('liquidacionId', String(liquidacionId));

        if(dataFromHook.evidencia && dataFromHook.evidencia.length > 0) {
            const file = dataFromHook.evidencia[0];
            if(file.type.startsWith('image/')) {
                const compressed = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    fileType: 'image/webp'
                });
                formPayload.append('file', new File([compressed], 'evidencia.webp', { type: 'image/webp'}));
            } else {
                formPayload.append('file', file)
            }
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
                <GastoCombustibleForm errors={errors} register={register} watch={watch}/>

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