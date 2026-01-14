import { Link, useNavigate } from "react-router-dom";
import UserFormRegister from "../../components/users/UserForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { UserFormData } from "../../types";
import { createUsers } from "../../api/users/UserAPI";
import { toast } from "react-toastify";


export default function UserCreateView() {
    const initialValues: UserFormData = {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "CAPTURISTA"
    }
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<UserFormData>({ defaultValues: initialValues});

    const { mutate, isPending} = useMutation({
        mutationFn: createUsers,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['users']})
            navigate("/usuarios");
        }
    });

    const handleForm  = (formData: UserFormData) => {
        mutate(formData);
    }
    return (
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className=" sm:flex sm:items-center">
                <div className=" sm:flex-auto">
                    <h1 className=" text-3xl font-bold leading-6 text-gray-900 dark:text-white">Crear usuario</h1>
                    <p className=" mt-2 text-sm text-gray-700 dark:text-gray-400">Completa la información para registrar un nuevo usuario en el sistema.</p>
                </div>
                <div className=" mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        to={"/usuarios"}
                        className=" mt-4 sm:mt-0 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                    >Volver</Link>
                </div>
            </div>
            <div className=" mt-8 bg-white dark:bg-gray-800 shadow rounded-xl p-6 md:p-10 border dark:border-gray-700">
                <form onSubmit={handleSubmit(handleForm)} noValidate className=" space-y-8">
                    <UserFormRegister 
                        register={register}
                        errors={errors}
                        watch={watch}
                    />

                    <div className=" flex justify-end pt-6 border-t dark:border-gray-700">
                     <button 
                        type="submit" 
                        disabled={isPending} 
                        className="w-full md:w-auto rounded-md bg-purple-600 px-10 py-3 text-sm font-bold text-white uppercase shadow-sm hover:bg-purple-500 disabled:opacity-50"
                    >{isPending ? "Guardando..." : "Registrar Usuario"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
