import { useForm } from "react-hook-form"
import type { Liquidacion, NotaFormData } from "../../types"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "../../api/notas/NotaAPI"
import { toast } from "react-toastify"

type AddNoteFormProps = {
    liquidacionId: Liquidacion['id']
}

export default function AddNoteForm({ liquidacionId}: AddNoteFormProps ) {

    const queryClient = useQueryClient();


    const initialValues: NotaFormData = {
        contenido: ''
    }

    const { register, handleSubmit, reset,formState: { errors }} = useForm({ defaultValues : initialValues })

    const { mutate, isPending } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message)
            reset()
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacionId] })
        }
    })

    const handleAddNote = (formData: NotaFormData) => {
        const data = {
            liquidacionId,
            formData
        }

        mutate(data)
    }
    return (
         <form 
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3 mt-4" 
            noValidate  
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300" htmlFor="contenido">
                    Nueva Nota
                </label>
                
                {/* Cambié input por textarea para escribir más cómodo */}
                <textarea 
                    id="contenido"
                    placeholder="Escribe una nota..."
                    className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-400 focus:ring-purple-600 focus:border-purple-600 resize-none h-20 text-sm shadow-sm"
                    {...register('contenido', {
                        required: 'El contenido de la nota es obligatorio'
                    })}
                ></textarea>

                {errors.contenido && (
                    <ErrorMessage>{errors.contenido.message}</ErrorMessage>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow disabled:opacity-50 transition-colors text-sm"
            >
                {isPending ? 'Agregando...' : 'Agregar Nota'}
            </button>
        </form>
    )
}
