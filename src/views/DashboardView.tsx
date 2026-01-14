import { useQuery } from "@tanstack/react-query"
import { getLiquidaciones } from "../api/LiquidacionAPI"
import LiquidacionesList from "../components/liquidaciones/LiquidacionesList"
import { useEffect, useState, useRef } from "react"

export default function DashboardView() {
    const [showUpdateToast, setShowUpdateToast] = useState(false);
    const prevDataRef = useRef<any>(null);

    const { data, isError, isLoading } = useQuery({
        queryKey: ['liquidaciones'],
        queryFn: getLiquidaciones,
        refetchInterval: 10000,
        refetchOnWindowFocus: true
    })

    // Solo mostrar cuando los datos cambiaron
    useEffect(() => {
        if (data && prevDataRef.current) {
            const dataChanged = JSON.stringify(data) !== JSON.stringify(prevDataRef.current);
            
            if (dataChanged) {
                setShowUpdateToast(true);
                
                const timer = setTimeout(() => {
                    setShowUpdateToast(false);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }
        
        prevDataRef.current = data;
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Cargando liquidaciones...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-4">
                    <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Error al cargar liquidaciones
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        No se pudieron cargar las liquidaciones. Por favor, intenta de nuevo.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }
    
    if(data) return (
        <div className="px-4 sm:px-6 lg:px-8 h-full relative">
            {/* Toast de actualización */}
            {showUpdateToast && (
                <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Datos actualizados</span>
                </div>
            )}

            <LiquidacionesList liquidaciones={data.liquidaciones}/>
        </div>
    )
}