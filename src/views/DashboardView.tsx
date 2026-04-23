import { useQuery } from "@tanstack/react-query"
import { getLiquidaciones } from "../api/liquidaciones/LiquidacionAPI";
import LiquidacionesList from "../components/liquidaciones/LiquidacionesList"
import { useEffect, useState, useRef } from "react"
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorQuery from "../components/ui/ErrorQuery";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function DashboardView() {
    const [showUpdateToast, setShowUpdateToast] = useState(false);
    const prevDataRef = useRef<any>(null);
    const { data: user } = useAuth();

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

    if (user?.rol === 'VENTAS') return <Navigate to="/programacion-salidas" replace />;

    if (isLoading) return <LoadingSpinner fullScreen mensaje="Cargando liquidaciones..."/>

    if (isError) return <ErrorQuery mensaje="No se pudieron cargar las liquidaciones." onRetry={() => window.location.reload()} />
    
    if(data) return (
        <div className="px-4 sm:px-6 lg:px-8 h-full relative mt-4">
            {/* Toast de actualización */}
            {showUpdateToast && (
                <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Datos actualizados</span>
                </div>
            )}

            <LiquidacionesList liquidaciones={data}/>
        </div>
    )
}
