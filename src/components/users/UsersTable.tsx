import { Link } from "react-router-dom"
import type { User } from "../../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeUserState } from "../../api/users/UserAPI"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

type UsersTableProps = {
    users: User[]
    total: number
}

// Mapeo de colores para los roles
const roleStyles: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    SISTEMAS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    DIRECTOR: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    CAPTURISTA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

export default function UsersTable({ users, total }: UsersTableProps) {

    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: changeUserState,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['users']})
        }
    });

    const handleChangeUserState = (user: User) => {
    const nextState = !user.activo;

    Swal.fire({
        title: "¿Estás seguro?",
        text: nextState
        ? "Este usuario volverá a tener acceso al sistema."
        : "Este usuario será desactivado y no podrá acceder al sistema.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: nextState ? "#16a34a" : "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: nextState ? "Activar" : "Desactivar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
                mutate({
                    userId: user.id,
                    formData: { activo: nextState }
                });
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando <strong className="text-gray-900 dark:text-white">{users.length}</strong> de <strong className="text-gray-900 dark:text-white">{total}</strong> usuarios
                </span>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rol</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {user.nombre} {user.apellido}
                                        </p>
                                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${roleStyles[user.rol] || "bg-gray-100 text-gray-700"}`}>
                                            {user.rol}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${user.activo ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400"}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${user.activo ? "bg-green-600" : "bg-red-600"}`}></span>
                                            {user.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            {user.email === 'soporte@mudanzasamado.mx' ? null : (
                                                <>
                                                    <Link 
                                                        to={`/usuarios/${user.id}/editar`}
                                                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        className={
                                                            user.activo
                                                            ? "text-red-600 hover:text-red-900 dark:text-red-400"
                                                            : "text-green-600 hover:text-green-900 dark:text-green-400"
                                                        }
                                                        onClick={() => handleChangeUserState(user)}
                                                        >
                                                        {user.activo ? "Desactivar" : "Activar"}
                                                    </button>
                                                </>
                                            )}
                                            

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}