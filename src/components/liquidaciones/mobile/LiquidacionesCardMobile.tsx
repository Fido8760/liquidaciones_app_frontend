import { Link } from 'react-router-dom';
import type { Liquidacion } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    UserCircleIcon, 
    PencilSquareIcon,
    ClockIcon
} from '@heroicons/react/20/solid';

type LiquidacionCardMobileProps = {
    liquidacion: Liquidacion;
}

export default function LiquidacionCardMobile({ liquidacion }: LiquidacionCardMobileProps) {
    const timeAgo = formatDistanceToNow(new Date(liquidacion.updatedAt), { 
        addSuffix: true, 
        locale: es 
    });

    return (
        <Link
            to={`/liquidaciones/${liquidacion.id}`}
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200
                       active:scale-[0.98]"
        >
            {/* Línea 1: Folio + Unidad */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <span className="text-gray-400">#</span>
                    <span>{liquidacion.folio_liquidacion}</span>
                    <span className="text-gray-400">|</span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {liquidacion.unidad.no_unidad}
                    </span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Línea 2: Operador */}
            <div className="flex items-center gap-1.5 mb-2">
                <UserCircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                    {liquidacion.operador.nombre} {liquidacion.operador.apellido_p}
                </p>
            </div>

            {/* Línea 3: Tipo de unidad */}
            <div className="flex items-center gap-1.5 mb-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    {liquidacion.unidad.tipo_unidad}
                </p>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-1">
                {/* Creado por */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <PencilSquareIcon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                        Creado por:{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {liquidacion.usuario_creador
                                ? `${liquidacion.usuario_creador.nombre} ${liquidacion.usuario_creador.apellido}`
                                : "Sistema"}
                        </span>
                    </span>
                </div>

                {/* Editado por (si existe) */}
                {liquidacion.usuario_editor && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pl-4">
                        <span className="truncate">
                            Editado por:{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {liquidacion.usuario_editor.nombre} {liquidacion.usuario_editor.apellido}
                            </span>
                        </span>
                    </div>
                )}

                {/* Última actualización */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 pt-1">
                    <ClockIcon className="w-3 h-3 flex-shrink-0" />
                    <span>{timeAgo}</span>
                </div>
            </div>
        </Link>
    );
}
