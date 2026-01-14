import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updatePasswordWithToken } from "../../api/auth/AuthApi";

type NewPasswordFormProps = {
    token: ConfirmToken['token']
}


export default function NewPasswordForm({token}: NewPasswordFormProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        confirmPassword: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const {mutate, isPending} = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate('/auth/login')
        }
    })


    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token
        }

        mutate(data)
    }

    const password = watch('password');

    return (
        <>

            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-6"
                noValidate
            >

                <div>
                    <label
                        className=" block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                                errors.password
                                    ? "ring-red-500 focus:ring-red-500 dark:ring-red-500"
                                    : "ring-gray-300 dark:ring-gray-700 focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800"
                            }`}
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: 'El Password debe ser mínimo de 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div>
                    <label
                        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                    >Repetir Password</label>

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                                errors.confirmPassword
                                    ? "ring-red-500 focus:ring-red-500 dark:ring-red-500"
                                    : "ring-gray-300 dark:ring-gray-700 focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800"
                            }`}
                        {...register("confirmPassword", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors.confirmPassword && (
                        <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending || false} // isPending viene de useMutation (asegúrate de desestructurarlo)
                    className="flex w-full justify-center rounded-lg bg-purple-600 px-3 py-2.5 text-sm font-bold leading-6 text-white shadow-md hover:bg-purple-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : 'Guardar Contraseña'}
                </button>
            </form>
        </>
    )
}