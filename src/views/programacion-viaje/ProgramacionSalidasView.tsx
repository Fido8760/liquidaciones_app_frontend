import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorQuery from "../../components/ui/ErrorQuery";
import { cambiarEstatus, cancelarProgramacion, eliminarProgramacion, getProgramacionHoy } from "../../api/salidas/ProgramacionSalidas";
import ModalCrearProgramacion from "../../components/salidas/ModalCrearProgramacion";
import ModalEditarProgramacion from "../../components/salidas/ModalEditarProgramacion";
import ProgramacionTable from "../../components/salidas/ProgramacionTable";
import { Link } from "react-router-dom";
import ProgramacionCards from "../../components/salidas/ProgramacionCards";
import ModalAsignarUnidad from "../../components/salidas/ModalAsignarUnidad";
import { toast } from "react-toastify";
import { motivoCancelacionSalidaSchema, type EstatusSalida } from "../../types";
import Swal from "sweetalert2";
import { getUnidades } from "../../api/liquidaciones/LiquidacionAPI";
import { getTodayLocalDate } from "../../utils/getLocalDate";
import { formatDateOnly } from "../../utils/formatDate";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";


export default function ProgramacionSalidasView() {

    const queryClient = useQueryClient();

    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');

    const [salidaId, setSalidaId] = useState<number | null>(null);

    const { data: unidadesData } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidades,
        staleTime: 1000 * 60 * 5
    });

    const { data: salidasHoy, isLoading, isError } = useQuery({
        queryKey: ['programacion-salidas', 'dia', fechaSeleccionada || 'hoy'],
        queryFn: () => getProgramacionHoy(fechaSeleccionada || undefined),
        refetchInterval: 30000,
        refetchOnWindowFocus: true
    });

    const { mutate: mutateCancelar } = useMutation({
        mutationFn: cancelarProgramacion,
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Programación cancelada');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas'] });
        }
    });

    const { mutate: mutateEliminar } = useMutation({
        mutationFn: eliminarProgramacion, // función que llama al DELETE en tu api
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Programación eliminada');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas'] });
        }
    });

    const { mutate: mutateEstatus } = useMutation({
        mutationFn: cambiarEstatus,
        onSuccess: () => {
            toast.success('Unidad en ruta');
            queryClient.invalidateQueries({ queryKey: ['programacion-salidas'] });
        },
        onError: (error: Error) => toast.error(error.message)
    });

    const hoy = getTodayLocalDate();
    const maxFecha = new Date();
    maxFecha.setDate(maxFecha.getDate() + 7);
    const maxFechaStr = `${maxFecha.getFullYear()}-${String(maxFecha.getMonth() + 1).padStart(2, '0')}-${String(maxFecha.getDate()).padStart(2, '0')}`;

    const fechaActual = fechaSeleccionada || hoy; // <- agrega esto

    const irDia = (dias: number) => {
        const base = new Date(fechaActual + 'T00:00:00');
        base.setDate(base.getDate() + dias);
        const nueva = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
        if (nueva >= hoy && nueva <= maxFechaStr) {
            setFechaSeleccionada(nueva);
        }
    };

    const handleAbrirEditar = (id: number) => {
        setSalidaId(id);
        setModalEditarOpen(true);
    };

    const handleCerrarEditar = () => {
        setModalEditarOpen(false);
        setSalidaId(null);
    };

    const handleAbrirAsignar = (id: number) => {
        setSalidaId(id);
        setModalAsignarOpen(true)
    };

    const handlerCerrarAsignar = () => {
        setModalAsignarOpen(false);
        setSalidaId(null);
    };

    const handleAbrirCancelar = async (id: number) => {
        const inputOptions = Object.fromEntries(
            motivoCancelacionSalidaSchema.options.map(m => [m, m])
        );

        const { value: motivo } = await Swal.fire({
            title: '¿Confrimar Cancelación?',
            text: "Esta acción no se puede deshacer",
            input: 'select',
            inputOptions,
            inputPlaceholder: 'Seleccione un motivo',
            showCancelButton: true,
            cancelButtonText: 'Regresar',
            confirmButtonText: 'Sí, cancelar servicio',
            inputValidator: (value) => !value ? 'Debes elegir un motivo' : null
        });

        if(motivo) {
            console.log(motivo)
            mutateCancelar({id, dto: { motivo_cancelacion: motivo}})
        }
    }

    const handleAbrirEliminar = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar programación?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#ef4444',
        });

        if (isConfirmed) {
            mutateEliminar(id);
        }
    };

    const handleCambiarEstatus = (id: number) => {
        // Solo permitimos cambiar a SALIO si el usuario confirma
        Swal.fire({
            title: '¿La unidad salió a ruta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, marcar salida',
            confirmButtonColor: '#16a34a',
        }).then((result) => {
            if (result.isConfirmed) {
                mutateEstatus({ id, dto: { estatus: 'SALIO' as EstatusSalida } });
            }
        });
    };

    const salidaSeleccionada = salidasHoy?.find(s => s.id === salidaId);

    if (isLoading) return <LoadingSpinner fullScreen mensaje="Cargando programación del día..." />;
    if (isError) return <ErrorQuery mensaje="Error al cargar la programación del día." />;

    if (!salidasHoy) return null;

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-10">
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-slate-200">
                            Programación del Día
                        </h1>
                        <div className=" flex items-center gap-2 mt-1">
                            <button
                                onClick={() => irDia(-1)}
                                disabled={fechaActual <= hoy}
                                className=" p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-500"
                            >
                                <ChevronLeftIcon className=" w-6 h-6" />
                            </button>
                            <p className=" text-xs sm:text-sm text-gray-500 dark:text-slate-400 capitalize">
                                {formatDateOnly(fechaActual, true)}
                            </p>
                            <button
                                onClick={() => irDia(1)}
                                disabled={fechaActual >= maxFechaStr}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-500"
                            >
                                <ChevronRightIcon className=" w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                         <Link
                            to="/programacion-salidas/historico"
                            className="flex-1 sm:flex-none justify-center flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Histórico
                        </Link>
                        <button
                            onClick={() => setModalCrearOpen(true)}
                            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Programar
                        </button>
                    </div>
                </div>

                {salidasHoy.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-50 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        <p className="text-sm font-medium">
                            No hay salidas programadas para {fechaActual === hoy ? 'hoy' : 'este día'}
                        </p>
                        <button
                            onClick={() => setModalCrearOpen(true)}
                            className="mt-4 text-blue-500 hover:underline text-sm"
                        >
                            Programar primera salida
                        </button>
                    </div>
                )}

                {salidasHoy.length > 0 && (
                    <>
                        <div className="hidden md:block">
                            <ProgramacionTable
                                salidas={salidasHoy}
                                onEditar={handleAbrirEditar}
                                onAsignar={handleAbrirAsignar}
                                onCancelar={handleAbrirCancelar}
                                onEliminar={handleAbrirEliminar}
                                onCambiarEstatus={handleCambiarEstatus}
                                esDiaActual={fechaActual === hoy}
                            />
                        </div>
                        <div className="md:hidden space-y-4">
                            <ProgramacionCards 
                                salidas={salidasHoy}
                                onEditar={handleAbrirEditar}
                                onAsignar={handleAbrirAsignar}
                                onCancelar={handleAbrirCancelar}
                                onEliminar={handleAbrirEliminar}
                                onCambiarEstatus={handleCambiarEstatus}
                                esDiaActual={fechaActual === hoy}
                            />
                        </div>
                    </>
                )}
            </section>

            <ModalCrearProgramacion
                isOpen={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                unidades={unidadesData?.unidades ?? []}
            />
            <ModalEditarProgramacion
                isOpen={modalEditarOpen}
                onClose={handleCerrarEditar}
                salidaId={salidaId}
                unidades={unidadesData?.unidades ?? []}
            />

            <ModalAsignarUnidad 
                isOpen={modalAsignarOpen}
                salidaId={salidaId}
                tipoUnidadSolicitado={salidaSeleccionada?.tipo_unidad_solicitado || ''}
                onClose={handlerCerrarAsignar}
            />
        </div>
    );
}
