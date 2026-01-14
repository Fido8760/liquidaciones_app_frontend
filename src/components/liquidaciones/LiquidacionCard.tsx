import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { CalendarIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, TruckIcon, UserCircleIcon, XCircleIcon, } from "@heroicons/react/20/solid";
import { EstadoLiquidacion, type Liquidacion } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLiquidacion, updateStatus } from "../../api/LiquidacionAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLiquidacionPermissions } from "../../hooks/useLiquidacionPermissions";
import { useAuth } from "../../hooks/useAuth";

type LiquidacionCardProps = {
    liquidacion: Liquidacion;
};

export default function LiquidacionCard({ liquidacion }: LiquidacionCardProps) {
    const { canEdit } = useLiquidacionPermissions(liquidacion);
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isSistemas = user?.rol === 'SISTEMAS';
    const isCancelada = liquidacion.estado === EstadoLiquidacion.CANCELADA;

    const { mutate: mutateDelete } = useMutation({
        mutationFn: deleteLiquidacion,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["liquidaciones"] });
        },
    });

    const { mutate: mutateStatus } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["liquidaciones"]});
        }
    })

    const handleDeleteClick = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, ¡eliminar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                mutateDelete(liquidacion.id);
            }
        });
    };
    
    const handleCancelClick = () => {
        Swal.fire({
            title: "¿Cancelar Liquidación?",
            text: "Esta acción es Irreversible. La liquidación quedará cancelada y ya no podrá ser modificada",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#374151',
            confirmButtonText: 'Sí, Cancelar',
            cancelButtonText: "No",
        }).then((result) => {
            if(result.isConfirmed) {
                mutateStatus({ 
                    liquidacionId: liquidacion.id,
                    status: EstadoLiquidacion.CANCELADA
                })
            }
        })
    }

    const showCancelButton = isSistemas && liquidacion.estado !== EstadoLiquidacion.PAGADA && liquidacion.estado !== EstadoLiquidacion.CANCELADA;

    return (
        <li className={`relative bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700 border-l-5
                        rounded-xl shadow-sm hover:shadow-lg 
                        hover:border-purple-200 dark:hover:border-purple-500/30
                        transition-all duration-200 group 
                        flex justify-between items-start p-5 gap-4 
                        ${isCancelada ? 'opacity-75 grayscale' : ''}
                        cursor-pointer`}>
            
            {/* --- ZONA IZQUIERDA: INFORMACIÓN (Clickeable) --- */}
            <div
                className="flex-1 min-w-0"
                onClick={() => navigate(`/liquidaciones/${liquidacion.id}`)}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-purple-600 transition-colors flex items-center gap-2">
                        {/* ⚠️ NUEVO: Icono según estado */}
                        {liquidacion.estado === EstadoLiquidacion.PAGADA && (
                            <span className="text-green-500 text-sm">✓</span>
                        )}
                        {liquidacion.estado === EstadoLiquidacion.CANCELADA && (
                            <span className="text-red-500 text-sm">✕</span>
                        )}
                        
                        <span className="text-gray-400">#</span>{" "}
                        {liquidacion.unidad.no_unidad} 

                        
                    </h3>
                    <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                        {liquidacion.folio_liquidacion}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <UserCircleIcon className="h-4 w-4 text-gray-400" />
                    <span className="truncate font-medium">
                        {liquidacion.operador.nombre} {liquidacion.operador.apellido_p}{" "}
                        {liquidacion.operador.apellido_m || ""}
                    </span>

                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <TruckIcon className="h-4 w-4 text-gray-400" />
                    <span className="truncate font-medium">
                        {liquidacion.unidad.tipo_unidad}
                    </span>

                </div>

                {/* Sección de Metadatos */}
                <div className="space-y-1 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Actualizado: {formatDate(liquidacion.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <PencilSquareIcon className="h-3 w-3" />
                        <span>
                            Creado por:{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {liquidacion.usuario_creador
                                    ? `${liquidacion.usuario_creador.nombre} ${liquidacion.usuario_creador.apellido}`
                                    : "Sistema"}
                            </span>
                        </span>
                    </div>

                    {liquidacion.usuario_editor && (
                        <div className="pl-4.5">
                            <span>
                                Editado por:{" "}
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {liquidacion.usuario_editor.nombre}{" "}
                                    {liquidacion.usuario_editor.apellido}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ZONA DERECHA: MENÚ (Fijo) --- */}
            <div className="flex-shrink-0 -mt-1 -mr-2">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button
                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                    >
                        <span className="sr-only">Opciones</span>
                        <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 dark:border-gray-700">
                            
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to={`/liquidaciones/${liquidacion.id}`}
                                        className={`block px-4 py-2 text-sm ${ active ? "bg-gray-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-200" }`}
                                    >Ver Detalles</Link>
                                )}
                            </Menu.Item>

                            {canEdit && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to={`/liquidaciones/${liquidacion.id}/editar`} 
                                            className={`block px-4 py-2 text-sm ${ active ? "bg-gray-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-200"}`}
                                        >Editar</Link>
                                    )}
                                </Menu.Item>
                            )}

                            {showCancelButton && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleCancelClick(); }}
                                            className={`group flex w-full items-center px-4 py-2 text-sm ${ active ? "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200" }`}
                                        >
                                            <XCircleIcon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                            Cancelar
                                        </button>
                                    )}
                                </Menu.Item>
                            )}

                            {isSistemas && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                                            className={`group flex w-full items-center px-4 py-2 text-sm border-t border-gray-100 dark:border-gray-700 ${ active ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" : "text-red-600 dark:text-red-400" }`}
                                        >
                                            <TrashIcon className="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
                                            Eliminar
                                        </button>
                                    )}
                                </Menu.Item>
                            )}

                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
    )
}