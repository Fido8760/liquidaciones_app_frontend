import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getLiquidacionById } from "../../api/LiquidacionAPI";
import DetalleHeader from "../../components/liquidaciones/liquidacion-detalle/DetalleHeader";
import DetalleTabs from "../../components/liquidaciones/liquidacion-detalle/DetalleTabs";
import ResumenTab from "../../components/liquidaciones/liquidacion-detalle/ResumenTab";
import DetalleGastoCombustible from "../../components/liquidaciones/liquidacion-detalle/gastoCombustible/DetalleGastoCombustible";
import DetalleGastoCaseta from "../../components/liquidaciones/liquidacion-detalle/gastoCasetas/DetalleGastoCaseta";
import DetalleGastoViaje from "../../components/liquidaciones/liquidacion-detalle/gastoViaje/DetalleGastoViaje";
import DetalleFlete from "../../components/liquidaciones/liquidacion-detalle/costoFlete/DetalleFlete";
import DetalleAnticipo from "../../components/liquidaciones/liquidacion-detalle/anticipo/DetalleAnticipo";
import DetalleDeducciones from "../../components/liquidaciones/liquidacion-detalle/deducciones/DetalleDeducciones";
import ModalGastosCostos from "../../components/liquidaciones/liquidacion-detalle/shared/ModalGastosCostos";
import ModalEditarGastosCostos from "../../components/liquidaciones/liquidacion-detalle/shared/ModalEditarGastosCostos";
import NotasPanel from "../../components/notas/NotasPanel";
import ModalAjustarLiquidacion from "../../components/liquidaciones/liquidacion-detalle/resumen/ModalAjustarLiquidacion";

export default function DetalleLiquidacionView() {
    const [activeTab, setActiveTab] = useState('resumen')
    const [showUpdateToast, setShowUpdateToast] = useState(false);
    const [showAjustarModal, setShowAjustarModal] = useState(false);
    const prevDataRef = useRef<any>(null);
    const params = useParams();
    const liquidacionId = +params.liquidacionId!;


    const { data: liquidacion, isLoading, isError} = useQuery({
        queryKey: ['liquidacion', liquidacionId],
        queryFn: () => getLiquidacionById(liquidacionId),
        retry: false,
        refetchInterval: 10000,
        refetchOnWindowFocus: true
    })

     useEffect(() => {
        if (liquidacion && prevDataRef.current) {
            const dataChanged = JSON.stringify(liquidacion) !== JSON.stringify(prevDataRef.current);
            
            if (dataChanged) {
                setShowUpdateToast(true);
                
                const timer = setTimeout(() => {
                    setShowUpdateToast(false);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }
        prevDataRef.current = liquidacion;
    }, [liquidacion]);

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto p-4 md:p-6">
                {/* Skeleton del header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 animate-pulse">
                    <div className="p-4 md:p-6">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>

                {/* Skeleton del contenido */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="max-w-[1600px] mx-auto p-4 md:p-6">
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="text-center max-w-md px-4">
                        {/* Ícono de error */}
                        <svg className="mx-auto h-20 w-20 text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        
                        {/* Mensaje */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No se pudo cargar la liquidación
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            La liquidación no existe o no tienes permisos para verla.
                        </p>

                        {/* Acciones */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reintentar
                            </button>
                            
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium px-5 py-2.5 rounded-lg transition-colors"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    if( liquidacion ) return (
        <>
            <div className="max-w-[1600px] mx-auto p-4 md:p-6">
                {showUpdateToast && (
                    <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Datos actualizados</span>
                    </div>
                )}

                <nav className="mb-4 px-4 md:px-0" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                            <Link 
                                to="/" 
                                className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li>
                            <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                Liquidaciones
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li className="font-medium text-gray-900 dark:text-white" aria-current="page">
                            #{liquidacion.folio_liquidacion}
                        </li>
                        
                    </ol>
                </nav>
                
                <DetalleHeader liquidacion={liquidacion} />
                {/* 1. Encabezado Global */}

                {/* 2. Grid Layout: Contenido Principal (Izquierda) vs Notas (Derecha) */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                    
                    {/* COLUMNA IZQUIERDA (2/3): Tabs y Detalles */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            
                            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                                <DetalleTabs activeTab={activeTab} onTabClick={setActiveTab}/>
                            </div>

                            <div className="min-h-[400px]">
                                {activeTab === 'resumen' && <ResumenTab liquidacion={liquidacion} /> }
                                {activeTab === 'gastos_combustible' && <DetalleGastoCombustible liquidacion={liquidacion} /> }
                                {activeTab === 'gastos_casetas' && <DetalleGastoCaseta liquidacion={liquidacion} /> }
                                {activeTab === 'gastos_varios' && <DetalleGastoViaje liquidacion={liquidacion} /> }
                                {activeTab === 'ingresos' && <DetalleFlete liquidacion={liquidacion} /> }
                                {activeTab === 'deducciones' && <DetalleDeducciones liquidacion={liquidacion} /> }
                                {activeTab === 'anticipos' && <DetalleAnticipo liquidacion={liquidacion} /> }
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">

                        <NotasPanel liquidacion={liquidacion}/>
                    </div>
                </div>
            </div>

            {/* Modales Globales */}
            <ModalGastosCostos />
            <ModalEditarGastosCostos />

            {showAjustarModal && (
                <ModalAjustarLiquidacion 
                    liquidacion={liquidacion}
                    onClose={() => setShowAjustarModal(false)}
                />
            )}

        </>
    )
}