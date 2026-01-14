import { Link, Navigate } from "react-router-dom";
import UsersTable from "../../components/users/UsersTable";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/users/UserAPI";

export default function UsersView() {

    const { data: currentUser} = useAuth();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
        enabled: !!currentUser
    });


    if (isLoading) return (
        <div className="flex justify-center items-center h-screen text-gray-500">
            <svg className="animate-spin h-8 w-8 mr-3 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando liquidación...
        </div>
    );
    
    if(currentUser?.rol !== 'SISTEMAS' ) {
        return <Navigate to={"/"} replace />
    }
    
    if (isError) return <p className="p-10 text-center text-red-500 font-bold">Error al cargar la liquidación. Verifica tu conexión.</p>

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
