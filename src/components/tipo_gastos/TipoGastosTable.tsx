import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import type { TipoGasto } from "../../types";

type TipoGastosTableProps = {
    tipoGastos: TipoGasto[];
    total: number;
    onAgregar: () => void;
    onEditar: (tipo: TipoGasto) => void;
    onToggle: (id: number) => void;
};

export default function TipoGastosTable({
    tipoGastos,
    total,
    onAgregar,
    onEditar,
    onToggle,
}: TipoGastosTableProps) {
    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando <strong className="text-gray-900 dark:text-white">{tipoGastos.length}</strong> de{" "}
                        <strong className="text-gray-900 dark:text-white">{total}</strong> tipos
                    </span>
                    <button
                        onClick={onAgregar}
                        className="flex items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Agregar Tipo
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:hidden">
                    {tipoGastos.map((tipo) => (
                        <div
                            key={tipo.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold text-gray-900 dark:text-white">{tipo.nombre}</p>
                                <button
                                    onClick={() => onToggle(tipo.id)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors
                                    ${tipo.activo ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400"}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${tipo.activo ? "bg-green-600" : "bg-red-600"}`}
                                    ></span>
                                    {tipo.activo ? "Activo" : "Inactivo"}
                                </button>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => onEditar(tipo)}
                                    className="flex items-center gap-1 text-purple-600 hover:text-purple-900 dark:text-purple-400 text-sm"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Estado
                                        <p className="text-xs font-normal normal-case text-gray-400 mt-0.5">
                                            Presiona para activar o desactivar
                                        </p>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {tipoGastos.map((tipo) => (
                                    <tr
                                        key={tipo.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {tipo.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => onToggle(tipo.id)}
                                                className={`inline-flex items-center gap-5 rounded-full px-2 py-1 text-xs font-medium transition-colors
                                                ${tipo.activo ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${tipo.activo ? "bg-green-600" : "bg-red-600"}`}
                                                ></span>
                                                {tipo.activo ? "Activo" : "Inactivo"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => onEditar(tipo)}
                                                    className="flex items-center gap-1 text-purple-600 hover:text-purple-900 dark:text-purple-400 text-sm"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
