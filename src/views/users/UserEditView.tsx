import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../api/users/UserAPI";
import { useForm } from "react-hook-form";
import type { UserFormData } from "../../types";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import UserForm from "../../components/users/UserForm";
import { toast } from "react-toastify";

export default function UserEditView() {
    const params = useParams();
    const userId = +params.userId!;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserById(userId),
        retry: false,
    });

    const { register, handleSubmit, formState: { errors }, watch, reset, } = useForm<UserFormData>();

    useEffect(() => { if (data) {
        reset({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            rol: data.rol,
        })}
    }, [data, reset]);

    const { mutate, isPending} = useMutation({
        mutationFn: updateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate("/usuarios");
        }
    })

    const handleForm = (formData: UserFormData) => {
        const data = {
            formData,
            userId
        }
        mutate(data)
    };

    if (isLoading)
        return (
        <div className="flex justify-center items-center h-screen text-gray-500">
            <svg className="animate-spin h-8 w-8 mr-3 text-purple-600" viewBox="0 0 24 24" >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" ></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando usuario…
        </div>
        );

    if (isError) return ( <p className="p-10 text-center text-red-500 font-bold"> Error al cargar el usuario. Verifica tu conexión.</p>);

    return (
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className=" sm:flex sm:items-center">
                <div className=" sm:flex-auto">
                    <h1 className=" text-3xl font-bold leading-6 text-gray-900 dark:text-white">
                        Actualizar usuario
                    </h1>
                    <p className=" mt-2 text-sm text-gray-700 dark:text-gray-400">
                        Realiza los cambios para la actualización de datos del usuario.
                    </p>
                </div>
                <div className=" mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                    to={"/usuarios"}
                    className=" mt-4 sm:mt-0 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                >
                    Volver
                </Link>
                </div>
            </div>
            <div className=" mt-8 bg-white dark:bg-gray-800 shadow rounded-xl p-6 md:p-10 border dark:border-gray-700">
                    <form
                        onSubmit={handleSubmit(handleForm)}
                        noValidate
                        className=" space-y-8"
                    >
                    <UserForm register={register} errors={errors} watch={watch} isEdit={true} />

                    <div className=" flex justify-end pt-6 border-t dark:border-gray-700">
                        <button
                        type="submit"
                        disabled={isPending}
                        className="w-full md:w-auto rounded-md bg-purple-600 px-10 py-3 text-sm font-bold text-white uppercase shadow-sm hover:bg-purple-500 disabled:opacity-50"
                        >
                        {isPending ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
