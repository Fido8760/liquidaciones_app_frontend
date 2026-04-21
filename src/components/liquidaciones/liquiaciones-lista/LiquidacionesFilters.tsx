import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOperadores, getUnidades } from '../../../api/liquidaciones/LiquidacionAPI'

export default function LiquidacionesFilters() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const { data: operadoresData } = useQuery({
        queryKey: ['operadores'],
        queryFn: getOperadores,
        staleTime: 1000 * 60 * 5,
    })

    const { data: unidadesData } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidades,
        staleTime: 1000 * 60 * 5,
    })

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.set('page', '1')
        navigate(`?${params.toString()}`)
    }

    const hayFiltros = ['operadorId', 'unidadId', 'folio', 'fechaInicio', 'fechaFin']
        .some(k => searchParams.has(k))

    const handleReset = () => navigate('?page=1')

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                {/* Operador */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Operador
                    </label>
                    {operadoresData?.operadores?.length ? (
                        <select
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchParams.get('operadorId') ?? ''}
                            onChange={e => updateParam('operadorId', e.target.value)}
                        >
                            <option value="">Todos</option>
                            {operadoresData.operadores.map(op => (
                                <option key={op.id} value={op.id}>
                                    {op.nombre} {op.apellido_p} {op.apellido_m}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="Buscar operador..."
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchParams.get('operadorId') ?? ''}
                            onChange={e => updateParam('operadorId', e.target.value)}
                        />
                    )}
                </div>

                {/* Unidad */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Unidad
                    </label>
                    {unidadesData?.unidades?.length ? (
                        <select
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchParams.get('unidadId') ?? ''}
                            onChange={e => updateParam('unidadId', e.target.value)}
                        >
                            <option value="">Todas</option>
                            {unidadesData.unidades.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.no_unidad} — {u.u_placas}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="Buscar unidad..."
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchParams.get('unidadId') ?? ''}
                            onChange={e => updateParam('unidadId', e.target.value)}
                        />
                    )}
                </div>

                {/* Folio */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Folio
                    </label>
                    <input
                        type="text"
                        placeholder="Ej. 60414"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchParams.get('folio') ?? ''}
                        onChange={e => updateParam('folio', e.target.value)}
                    />
                </div>

                {/* Fecha inicio */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Fecha inicio
                    </label>
                    <input
                        type="date"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchParams.get('fechaInicio') ?? ''}
                        onChange={e => updateParam('fechaInicio', e.target.value)}
                    />
                </div>

                {/* Fecha fin */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Fecha fin
                    </label>
                    <input
                        type="date"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchParams.get('fechaFin') ?? ''}
                        onChange={e => updateParam('fechaFin', e.target.value)}
                    />
                </div>
            </div>

            {hayFiltros && (
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleReset}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                    >
                        ✕ Limpiar filtros
                    </button>
                </div>
            )}
        </div>
    )
}