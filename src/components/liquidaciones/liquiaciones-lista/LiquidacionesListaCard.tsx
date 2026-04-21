// LiquidacionListaCard.tsx
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, TruckIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import type { Liquidacion } from '../../../types'

interface Props {
    liquidacion: Liquidacion;
}

const ESTADO_STYLES: Record<string, { bg: string; text: string }> = {
    BORRADOR:    { bg: 'bg-slate-100 dark:bg-slate-800',    text: 'text-slate-600 dark:text-slate-300' },
    EN_REVISION: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-400' },
    APROBADA:    { bg: 'bg-blue-100 dark:bg-blue-900/50',   text: 'text-blue-700 dark:text-blue-400' },
    PAGADA:      { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-400' },
    CANCELADA:   { bg: 'bg-red-100 dark:bg-red-900/50',     text: 'text-red-700 dark:text-red-400' },
}

const ESTADO_LABELS: Record<string, string> = {
    BORRADOR:    'Borrador',
    EN_REVISION: 'En Revisión',
    APROBADA:    'Aprobada',
    PAGADA:      'Pagada',
    CANCELADA:   'Cancelada',
}

export default function LiquidacionListaCard({ liquidacion }: Props) {
    const navigate = useNavigate()
    const estado = ESTADO_STYLES[liquidacion.estado]

    const nombreOperador = `${liquidacion.operador.nombre} ${liquidacion.operador.apellido_p} ${liquidacion.operador.apellido_m}`

    const esFavorable = liquidacion.rendimiento_real !== null
        ? liquidacion.rendimiento_real >= liquidacion.rendimiento_tabulado
        : null

    return (
        <div
            onClick={() => navigate(`/liquidaciones/${liquidacion.id}`)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-900 dark:text-white font-semibold">
                        #{liquidacion.folio_liquidacion}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estado.bg} ${estado.text}`}>
                        {ESTADO_LABELS[liquidacion.estado]}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md shrink-0">
                    {liquidacion.unidad.tipo_unidad}
                </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-700 mb-3" />

            {/* Datos */}
            <div className="space-y-2">

                {/* Operador */}
                <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-slate-300 truncate">
                        {nombreOperador}
                    </span>
                </div>

                {/* Unidad */}
                <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                        Unidad {liquidacion.unidad.no_unidad}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {liquidacion.unidad.u_placas}
                    </span>
                </div>

                {/* Fechas */}
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                        {liquidacion.fecha_inicio} — {liquidacion.fecha_fin}
                    </span>
                </div>

                {/* Km y rendimiento */}
                <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                        {Number(liquidacion.kilometros_recorridos).toLocaleString('es-MX')} km
                    </span>
                    {esFavorable !== null && liquidacion.rendimiento_real !== null && (
                        <span className={`text-xs font-medium ${esFavorable ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            {esFavorable ? '↑' : '↓'} {Number(liquidacion.rendimiento_real).toFixed(2)} km/l
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}