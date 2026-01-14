import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserLoginForm } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import { authenticateUser } from "../../api/auth/AuthApi";
import { toast } from "react-toastify";

export default function LoginView() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const initialValues: UserLoginForm = {
        email: '',
        password: ''
    }

    const { register, handleSubmit, formState: { errors }} = useForm({
        defaultValues: initialValues
    })

    const { mutate, isPending} = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async () => {
            toast.success('Iniciando sesión...')
            await queryClient.resetQueries({ queryKey: ['auth-user'], exact: true })
            navigate('/')
        }
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <form className=" space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
                <label htmlFor="email" className=" block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Correo Electrónico</label>
                <div className=" mt-2">
                    <input 
                        type="email"  
                        id="email" 
                        autoComplete="email" 
                        placeholder="Ej. correo@correo.com" 
                        className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.email ? 'ring-red-500 focus:ring-red-500 dark:ring-red-500' : ' ring-gray-300 dark:ring-gray-700 focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800'}`}
                        {...register("email", {
                            required: 'Elcorreo es obligatorio',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            }
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
            </div>
            
            <div>
                <div className=" flex items-center justify-between">
                    <label htmlFor="password" className=" block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Contraseña</label>
                    <div className=" text-sm">
                        <Link to={"/auth/olvide-password"} className=" font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">¿Olvidaste tu contraseña?</Link>
                    </div>
                </div>
                <div className=" mt-2">
                    <input 
                        type="password" 
                        id="password" 
                        autoComplete="current-password" 
                        className={`block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.password ? 'ring-red-500 focus:ring-red-500 dark:ring-red-500' : ' ring-gray-300 dark:ring-gray-700 focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800'}`}
                        {...register("password", {
                            required: 'La contraseña es obligatoria'
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-lg bg-purple-600 px-3 py-2.5 text-sm font-bold leading-6 text-white shadow-md hover:bg-purple-700 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <svg className=" animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className=" opacity-75" cx={"12"} cy={"12"} r={"10"} stroke="currentColor" strokeWidth={"4"}></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>

                            Iniciando Sesión...
                        </div>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </div>
        </form>
    )
}
