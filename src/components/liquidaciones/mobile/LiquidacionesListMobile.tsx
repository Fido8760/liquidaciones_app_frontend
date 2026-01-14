import { useEffect, useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import type { Liquidacion } from "../../../types"
import { Link } from "react-router-dom"
import EstadoAccordion from "./EstadoAccordion"

type LiquidacionesListMobileProps = {
    liquidaciones: Liquidacion[]
}

type GroupedLiquidaciones = {
    [key: string]: Liquidacion[]
}

export default function LiquidacionesListMobile({liquidaciones}: LiquidacionesListMobileProps) {
    
    const { data: user } = useAuth();
    const puedeCrear = user?.rol === 'CAPTURISTA' || user?.rol === 'SISTEMAS';

    const groupedLiquidaciones = liquidaciones.reduce<GroupedLiquidaciones>((acc, liquidacion) => {
        if(!acc[liquidacion.estado]) {
            acc[liquidacion.estado] = [];
        }
        acc[liquidacion.estado].push(liquidacion)
        return acc;
    }, {});

    const estadosOrdenados = ['BORRADOR', 'EN_REVISION', 'APROBADA', 'PAGADA', 'CANCELADA'];

    const estadosConLiquidaciones = estadosOrdenados.filter( estado => groupedLiquidaciones[estado]?.length > 0);

    const [expandedstates, setExpandedStates] = useState<string[]>(() => {
        const saved = localStorage.getItem('liquidaciones-expanded-states');
        if(saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                return estadosConLiquidaciones;
            }
        }
        return estadosConLiquidaciones;
    });

    useEffect(() => {
        localStorage.setItem('liquidaciones-expanded-states', JSON.stringify(expandedstates))
    }, [expandedstates]);

    const toggleState = (estado: string) => {
        setExpandedStates(prev => prev.includes(estado) ? prev.filter(e => e !== estado) : [...prev, estado]);
    };

    const stats = {
        total: liquidaciones.length,
        borrador: groupedLiquidaciones['BORRADOR']?.length || 0,
        revision: groupedLiquidaciones['EN_REVISION']?.length || 0,
        aprobada: groupedLiquidaciones['APROBADA']?.length || 0,
        pagada: groupedLiquidaciones['PAGADA']?.length || 0,
        cancelada: groupedLiquidaciones['CANCELADA']?.length || 0,
    };

    return (
        <div className=" h-full flex flex-col pb-4">
            <div className=" sticky top-16 z-20 bg-gray-50 dark:bg-gray-950 pb-4">
                <div className=" flex justify-between items-center mb-4">
                    <h1 className=" text-2xl font-bold text-gray-800 dark:text-slate-200">
                        Liquidaciones
                    </h1>
                    {puedeCrear && (
                        <Link
                            to="/liquidaciones/crear"
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Nueva</span>
                        </Link>
                    )}
                </div>
                 <div className=" grid grid-cols-6 gap-2">
                    <div className=" bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700 text-center">
                        <p className=" text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        <p className=" text-[10px] text-gray-500 dark:text-gray-400 uppercase">Total</p>
                    </div>
                    <div className=" bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-center">
                        <p className=" text-xl font-bold text-slate-700 dark:text-slate-300">{stats.borrador}</p>
                        <p className=" text-[10px] text-slate-600 dark:text-slate-400 uppercase">Borr</p>
                    </div>
                    <div className=" bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-200 dark:border-amber-800 text-center">
                        <p className=" text-xl font-bold text-amber-700 dark:text-amber-300">{stats.revision}</p>
                        <p className=" text-[10px] text-amber-600 dark:text-amber-400 uppercase">Rev</p>
                    </div>
                    <div className=" bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800 text-center">
                        <p className=" text-xl font-bold text-blue-700 dark:text-blue-300">{stats.aprobada}</p>
                        <p className=" text-[10px] text-blue-600 dark:text-blue-400 uppercase">Apr</p>
                    </div>
                    <div className=" bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800 text-center">
                        <p className=" text-xl font-bold text-green-700 dark:text-green-300">{stats.pagada}</p>
                        <p className=" text-[10px] text-green-600 dark:text-gray-400 uppercase">Pag</p>
                    </div>
                    <div className=" bg-red-50 dark:bg-red-900/20 rounded-lg p-2 border border-red-200 dark:border-red-800 text-center">
                        <p className=" text-xl font-bold text-red-700 dark:text-red-300">{stats.cancelada}</p>
                        <p className=" text-[10px] text-red-600 dark:text-red-400 uppercase">Can</p>
                    </div>
                 </div>
            </div>
            <div className=" flex-grow overflow-y-auto">
                {estadosOrdenados.map(estado => {
                    const liquidacionesEnEstado = groupedLiquidaciones[estado] || [];
                    if(liquidacionesEnEstado.length === 0) return null;
                    return (
                        <EstadoAccordion 
                            key={estado}
                            estado={estado}
                            liquidaciones={liquidacionesEnEstado}
                            isExpanded={expandedstates.includes(estado)}
                            onToggle={() => toggleState(estado)}
                        />
                    )
                })}
            </div>
        </div>
    )
}
