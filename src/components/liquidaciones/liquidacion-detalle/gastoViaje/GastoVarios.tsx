import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import GastoVariosForm from "./GastoVariosForm"
import type { GastoVarioFormData } from "../../../../types"
import { createGastoVarios } from "../../../../api/VariosAPI"
import { toast } from "react-toastify"
import imageCompression from 'browser-image-compression'

type GastoVariosProps = {
    onSuccess: () => void
    liquidacionId: number
}

export default function GastoVarios({ onSuccess, liquidacionId }: GastoVariosProps) {
    
    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<GastoVarioFormData>({ defaultValues: {
        concepto: '',
        monto: 0,
        observaciones: '',
    }})

    const { mutate, isPending } = useMutation({
        mutationFn: createGastoVarios,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Se ha añadido el gasto correctamente')
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId]})
            onSuccess()
            reset()
        }
    })

    const handleForm = async (dataFromHook: GastoVarioFormData) => {
        const formPayload = new FormData()

        formPayload.append('monto', String(dataFromHook.monto))
        formPayload.append('concepto', dataFromHook.concepto)
        formPayload.append('observaciones', String(dataFromHook.observaciones))
        formPayload.append('liquidacionId', String(liquidacionId))

        if( dataFromHook.evidencia && dataFromHook.evidencia.length > 0 ) {
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
                <GastoVariosForm errors={errors} register={register} />
        
                <input
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400"
                    value={isPending ? 'Guardando...' : 'Agregar'}
                    disabled={isPending}
                />
            </form>
        </>
    )
}
