import { Link } from 'react-router-dom';
import type { Liquidacion } from '../../types'; // Asegúrate de que Liquidacion tenga un 'id'
import LiquidacionCard from './LiquidacionCard';
import { useAuth } from '../../hooks/useAuth';

type LiquidacionesListProps = {
    liquidaciones: Liquidacion[];
}

type GroupedLiquidaciones = {
    [key: string]: Liquidacion[];
}

const formatoEstados: { [key: string]: string } = {
    BORRADOR: 'Borrador',
    EN_REVISION: 'En Revisión',
    APROBADA: 'Aprobada',
    PAGADA: 'Pagada',
    CANCELADA: 'Cancelada',
};

const coloresEstadosUI: { [key: string]: { bg: string; text: string; ring: string } } = {
    BORRADOR:    { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', ring: 'ring-slate-500' },
    EN_REVISION: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-400', ring: 'ring-amber-500' },
    APROBADA:    { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-400', ring: 'ring-blue-500' },
    PAGADA:      { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-400', ring: 'ring-green-500' },
    CANCELADA:   { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-400', ring: 'ring-red-500' },
};


export default function LiquidacionesKanban({ liquidaciones }: LiquidacionesListProps) {

    const stats = {
        total: liquidaciones.length,
        borrador: liquidaciones.filter(l => l.estado === 'BORRADOR').length,
        revision: liquidaciones.filter(l => l.estado === 'EN_REVISION').length,
        aprobada: liquidaciones.filter(l => l.estado === 'APROBADA').length,
        pagada: liquidaciones.filter(l => l.estado === 'PAGADA').length,
        cancelada: liquidaciones.filter(l => l.estado === 'CANCELADA').length,
    }

    const { data: user } = useAuth();
    const puedeCrear = user?.rol === 'CAPTURISTA' || user?.rol === 'SISTEMAS';


    const groupedLiquidaciones = liquidaciones.reduce<GroupedLiquidaciones>((acc, liquidacion) => {

        if (!acc[liquidacion.estado]) {
            acc[liquidacion.estado] = [];
        }
        acc[liquidacion.estado].push(liquidacion);
        return acc;
    }, {})
    
    const estadosOrdenados = ['BORRADOR', 'EN_REVISION', 'APROBADA', 'PAGADA', 'CANCELADA'];

    return (
        <div className="h-full flex flex-col">
            {/* Encabezado de la página */}
            <div className="flex justify-between items-center gap-4 md:gap-0 mb-6 px-4 md:px-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">Tablero de Liquidaciones</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Aquí podrás revisar las liquidaciones que se han capurado.</p>
                </div>
                {puedeCrear && (
                    <Link
                        to="/liquidaciones/crear"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Nueva Liquidación</span>
                    </Link>

                )}
            </div>

            <div className=' grid grid-cols-2 md:grid-cols-6 gap-3 mb-6 px-4 md:px-0'>
                <div className=' bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <div className=' flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>Total</p>
                            <p className=' text-2xl font-bold text-gray-900 dark:text-white mt-1'>{stats.total}</p>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className=' bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm'>
                    <p className=' text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide'>Borrador</p>
                    <p className=' text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1'>{stats.borrador}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 shadow-sm">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        Revisión
                    </p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                        {stats.revision}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-sm">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        Aprobadas
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                        {stats.aprobada}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 shadow-sm">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                        Pagadas
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                        {stats.pagada}
                    </p>
                </div>
                 <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 shadow-sm">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                        Canceladas
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                        {stats.cancelada}
                    </p>
                </div>
            </div>
            
            {/* Contenedor del tablero Kanban con scroll mejorado */}
            <div className='flex-grow flex gap-5 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
                {estadosOrdenados.map((estado) => {
                    const liquidacionesEnEstado = groupedLiquidaciones[estado] || [];
                    const uiColors = coloresEstadosUI[estado];
                    
                    return (
                        <div key={estado} className='min-w-[320px] w-[320px] bg-gray-100/60 dark:bg-gray-800/50 rounded-xl flex flex-col'>
                            {/* Encabezado de la Columna */}
                            <div className={`flex items-center justify-between p-3 rounded-t-xl ${uiColors.bg}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${uiColors.bg.replace('bg-', 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ').replace('100', '400').replace('900/50', '500')}`}></span>
                                    <h3 className={`font-bold uppercase tracking-wider text-sm ${uiColors.text}`}>
                                        {formatoEstados[estado]}
                                    </h3>
                                </div>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full 
                                                bg-white/40 dark:bg-gray-900/40 
                                                ${uiColors.text} opacity-60`}>
                                    {liquidacionesEnEstado.length}
                                </span>
                            </div>
                            
                            {/* Lista de Tarjetas (Drop Zone) */}
                            <ul className='flex-grow p-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700'>
                                {liquidacionesEnEstado.length === 0 ? (
                                    // Estado Vacío mejorado
                                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-50">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v3.776" />
                                        </svg>
                                        <p className="mt-4 text-sm">No hay liquidaciones en este estado.</p>
                                    </div>
                                ) : (
                                    liquidacionesEnEstado.map(liquidacion => <LiquidacionCard key={liquidacion.id} liquidacion={liquidacion} />)
                                )}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}