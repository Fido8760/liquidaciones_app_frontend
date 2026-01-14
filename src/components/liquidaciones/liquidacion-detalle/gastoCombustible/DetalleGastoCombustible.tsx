import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import type { Liquidacion } from "../../../../types"
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCombustible } from "../../../../api/CombustibleAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useLiquidacionPermissions } from "../../../../hooks/useLiquidacionPermissions";


type DetalleGastoCombustibleProps = {
    liquidacion: Liquidacion
}

export default function DetalleGastoCombustible({ liquidacion }: DetalleGastoCombustibleProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()

    const { canEdit } = useLiquidacionPermissions(liquidacion)

    const {mutate} = useMutation({
        mutationFn: deleteCombustible,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacion.id]})
        }

    })

    const handleDeleteClick = (gastoId: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(gastoId);
            }
        });
    };

    return (
        <div className="p-4">
            <nav className=" my-5 flex gap-3 justify-between items-center">
                <p className="text-sm font-semibold mb-4 dark:text-white">Aquí podras ver el detalle de los gasto de combustible</p>
                {canEdit && (
                    <button
                        type="button"
                        className=" bg-purple-400 hover:bg-purple-500 cursor-pointer px-5 py-1 text-white text-sm font-bold transition-colors rounded-lg"
                        onClick={() => navigate('?modalGasto=combustible')}
                    >Agregar Combustible</button>

                )}
            </nav>
            <ul className="space-y-2">
                { liquidacion.gastos_combustible!.length > 0 ? (
                    liquidacion.gastos_combustible!.map((gasto) => (
                    <li key={gasto.id} className="flex flex-col sm:flex-row justify-between items-center gap-4 border rounded-xl p-4 shadow-sm dark:border-gray-400">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                            <p className="dark:text-white"><span className="font-medium dark:text-amber-200">Litros:</span> {gasto.litros}</p>
                            <p className="dark:text-white"><span className="font-medium dark:text-gray-300">Precio por litro:</span> {formatCurrency(gasto.precio_litro)}</p>
                            <p className="dark:text-white"><span className="font-medium dark:text-blue-200">Monto:</span> {formatCurrency(gasto.monto)}</p>
                            <p className="dark:text-white"><span className="font-medium dark:text-gray-200" >Método de pago:</span> {gasto.metodo_pago}</p>
                            <p>
                                <span className="font-medium dark:text-amber-50">Evidencia:</span>{" "}
                                { gasto.evidencia !== 'default.pdf' ? (
                                    <a
                                        href={gasto.evidencia!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                    Ver archivo
                                    </a>
                                ) : (
                                    <span className="text-gray-400 italic">No disponible</span>
                                )}
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            {canEdit && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => navigate(location.pathname + `?editar=combustible&combustibleId=${gasto.id}`)}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        aria-label="Editar gasto"
                                    ><PencilIcon className=" h-4 w-4"/> Editar</button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick(gasto.id)}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        aria-label="Eliminar gasto"
                                    ><TrashIcon className=" h-4 w-4"/>Eliminar</button>
                                
                                </>
                            )}

                        </div>
                    </li>
                ))
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-300">No hay gastos de combustible registrados.</p>
            )}
            </ul>
        </div>
    );
}
