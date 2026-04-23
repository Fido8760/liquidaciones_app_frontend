import { Link, Navigate } from "react-router-dom";
import UsersTable from "../../components/users/UsersTable";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/users/UserAPI";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorQuery from "../../components/ui/ErrorQuery";

export default function UsersView() {

    const { data: currentUser} = useAuth();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
        enabled: !!currentUser
    });


    if (isLoading) return (
        <LoadingSpinner fullScreen mensaje="Cargando usuarios" />
    );
    
    if(currentUser?.rol !== 'SISTEMAS' ) {
        return <Navigate to={"/"} replace />
    }
    
    if (isError) return <ErrorQuery />

    if (data) return (
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className=" sm:flex sm:items-center">
                <div className=" sm:flex-auto">
                    <h1 className=" text-3xl font-bold leading-6 text-gray-900 dark:text-white">Administración de usuarios</h1>
                    <p className=" mt-2 text-sm text-gray-700 dark:text-gray-400">Gestión de accesos y roles del sistema.</p>
                </div>
                <div className=" mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        to={"crear"}
                        className=" block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
                    >Agregar Usuario</Link>
                </div>
            </div>
            <div className=" mt-8 flow-root">
                <UsersTable users={data.users} total={data.total} />
            </div>
        </div>
    )
}
