import type { Operador } from '../../types'

type OperadorSelectorProps = {
    operadores: Operador[]
    operadorId: number | null
    fechaInicio: string
    fechaFin: string
    onOperadorChange: (id: number | null) => void
    onFechaInicioChange: (fecha: string) => void
    onFechaFinChange: (fecha: string) => void
}

export default function OperadorSelector({ operadores, operadorId, fechaInicio, fechaFin, onOperadorChange, onFechaInicioChange, onFechaFinChange, }: OperadorSelectorProps) {

    const hayFiltroFecha = fechaInicio || fechaFin

    const handleLimpiar = () => {
        onFechaInicioChange('')
        onFechaFinChange('')
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Operador */}
                <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Operador
                    </label>
                    <select
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={operadorId ?? ''}
                        onChange={e => onOperadorChange(e.target.value ? +e.target.value : null)}
                    >
                        <option value="">Selecciona un operador...</option>
                        {operadores.map(op => (
                            <option key={op.id} value={op.id}>
                                {op.apellido_p} {op.apellido_m} {op.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fecha inicio */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Desde
                    </label>
                    <input
                        type="date"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={fechaInicio}
                        onChange={e => onFechaInicioChange(e.target.value)}
                    />
                </div>

                {/* Fecha fin */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Hasta
                    </label>
                    <input
                        type="date"
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 h-9 text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={fechaFin}
                        onChange={e => onFechaFinChange(e.target.value)}
                    />
                </div>
            </div>

            {hayFiltroFecha && (
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleLimpiar}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                    >
                        ✕ Limpiar fechas
                    </button>
                </div>
            )}
        </div>
    )
}