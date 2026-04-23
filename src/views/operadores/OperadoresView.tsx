import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { getOperadores } from "../../api/liquidaciones/LiquidacionAPI";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorQuery from "../../components/ui/ErrorQuery";
import OperadorSelector from "../../components/operadores/OperadorSelector";
import OperadorKpis from "../../components/operadores/OperadorKpis";

export default function OperadoresView() {
    const [operadorId, setOperadorId] = useState<number | null>(null);
    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');

    const { data: operadoresData, isLoading, isError} = useQuery({
        queryKey: ['operadores'],
        queryFn: getOperadores,
        staleTime: 1000 * 600 * 5 
    });

    if(isLoading) return <LoadingSpinner fullScreen mensaje="Cargando Operadores..." />
    if(isError) return <ErrorQuery mensaje="Error al cargar los operadores." />

    if(operadoresData) return (
        <div className=" max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6">
                <h1 className=" text-3xl font-bold text-gray-800 dark:text-slate-200">Operadores</h1>
                <p className=" text-gray-500 dark:text-slate-400 mt-1">
                    Consulta el rendimiento e historial de cada operador
                </p>
            </div>
            <OperadorSelector 
                operadores={operadoresData.operadores}
                operadorId={operadorId}
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                onOperadorChange={setOperadorId}
                onFechaInicioChange={setFechaInicio}
                onFechaFinChange={setFechaFin}
            />
            {operadorId && (
                <OperadorKpis 
                    operadorId={operadorId}
                    operador={operadoresData.operadores.find(o => o.id === operadorId)!}
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                />
            )}

            {!operadorId && (
                <div className=" flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-50 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <p className=" text-sm font-medium">Selecciona un operador para ver sus KPIs</p>
                </div>
            )}
        </div>
    )
}
