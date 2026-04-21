import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorQuery from "../../components/ui/ErrorQuery";
import { eliminarProgramacion, getProgramacionHistorico, getProgramacionStats } from "../../api/salidas/ProgramacionSalidas";
import ProgramacionTable from "../../components/salidas/ProgramacionTable";
import ProgramacionCards from "../../components/salidas/ProgramacionCards";
import ProgramacionStatsPanel from "../../components/salidas/ProgramacionStatsPanel";
import { useAuth } from "../../hooks/useAuth";

const HISTORICO_LIMIT = 10;

export default function HistoricoSalidasView() {

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [page, setPage] = useState(1);

    const queryClient = useQueryClient();
    const { data: user } = useAuth();

    const { data: historico, isLoading, isError } = useQuery({
        queryKey: ['programacion-salidas', 'historico', fechaInicio, fechaFin, page, HISTORICO_LIMIT],
        queryFn: () => getProgramacionHistorico({
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            page,
            limit: HISTORICO_LIMIT,
        }),
        enabled: !!user,
    });

    const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useQuery({
        queryKey: ['programacion-salidas', 'stats', fechaInicio, fechaFin],
        queryFn: () => getProgramacionStats({
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
        }),
        enabled: !!user,
    });

    console.log(stats?.por_estatus)

    useEffect(() => {
        setPage(1);
    }, [fechaInicio, fechaFin]);


    const { mutate: mutateEliminar } = useMutation({
        mutationFn: eliminarProgramacion,
        onSuccess: (data: { message?: string } | string) => {
            toast.success(typeof data === 'string' ? data : data.message ?? 'Registro eliminado correctamente');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas'] });
        },
        onError: (error: Error) => toast.error(error.message)
    });


    const handleEliminar = async (id: number) => {
        const salida = historico?.salidas.find(s => s.id === id);
        if (!salida) return;

        const result = await Swal.fire({
            title: '¿Eliminar salida programada?',
            html: `
                <p>Esta acción es irreversible.</p>
                <p class="mt-2 text-sm">Se eliminará la salida de <strong>${salida.cliente}</strong> para la unidad <strong>${salida.unidad?.no_unidad || 'N/A'}</strong>.</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) mutateEliminar(id);
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Link to="/programacion-salidas" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Programación del Día
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">Histórico</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">Histórico de Salidas</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Consulta viajes anteriores por rango de fechas.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                        Fecha inicio
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                        Fecha fin
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                        />
                    </label>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{historico ? `${historico.total} registros encontrados` : 'Cargando...'}</span>
                {(fechaInicio || fechaFin) && (
                    <button
                        onClick={() => { setFechaInicio(""); setFechaFin(""); }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {user?.rol !== 'VENTAS' && user?.rol !== 'CAPTURISTA' && (
                <>
                    {isStatsLoading && <LoadingSpinner mensaje="Calculando estadísticas..." />}
                    {isStatsError && <ErrorQuery mensaje="Error al cargar las estadísticas del histórico." />}
                    {!isStatsLoading && !isStatsError && stats && (
                        <ProgramacionStatsPanel stats={stats} />
                    )}
                </>
            )}

            {isLoading && <LoadingSpinner mensaje="Cargando histórico..." />}
            {isError && <ErrorQuery mensaje="Error al cargar el histórico de salidas." />}

            {!isLoading && !isError && historico && (
                <>
                    {historico.salidas.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No se encontraron salidas con los filtros seleccionados.
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block">
                                <ProgramacionTable
                                    salidas={historico.salidas}
                                    onEliminar={handleEliminar}
                                    modoHistorico={true}
                                />
                            </div>
                            <div className="md:hidden space-y-4">
                                <ProgramacionCards
                                    salidas={historico.salidas}
                                    onEliminar={handleEliminar}
                                    modoHistorico={true}
                                />
                            </div>
                        </>
                    )}

                    {historico.totalPages > 1 && (
                        <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Página {historico.page} de {historico.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    disabled={historico.page === 1}
                                    className="rounded-lg border text-slate-700 dark:text-slate-300 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-medium disabled:opacity-40"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(p + 1, historico.totalPages))}
                                    disabled={historico.page >= historico.totalPages}
                                    className="rounded-lg border text-slate-700 dark:text-slate-300 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-medium disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
