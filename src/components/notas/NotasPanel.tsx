import { useAuth } from '../../hooks/useAuth';
import type { Liquidacion } from '../../types'
import { formatDate } from '../../utils/formatDate';
import AddNoteForm from './AddNoteForm'

type NotasPanelProps = {
    liquidacion: Liquidacion
}

export default function NotasPanel({liquidacion}: NotasPanelProps) {

  const { data: user } = useAuth();
  const notas = liquidacion.notas || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-[600px] sticky top-24">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-600">
                    <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
                </svg>
                Historial de Notas ({notas.length})
            </h3>
        </div>

        {/* Lista de Notas (Scrollable) */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            
            {notas.length === 0 && (
                <div className="text-center py-10 opacity-60">
                    <p className="text-sm">No hay notas registradas.</p>
                </div>
            )}

            {notas.map(nota => {
                const isMe = user?.id === nota.usuario.id;

                return (
                    <div key={nota.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        
                        {/* Burbuja */}
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm border ${
                            isMe 
                                ? 'bg-purple-600 text-white border-purple-600 rounded-br-none' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 rounded-bl-none'
                        }`}>
                            <p className="whitespace-pre-wrap">{nota.contenido}</p>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="mt-1 flex items-center gap-1.5 px-1">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                {isMe ? 'Tú' : `${nota.usuario.nombre} ${nota.usuario.apellido}`}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                • {formatDate(nota.createdAt)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Formulario Fijo Abajo */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <AddNoteForm liquidacionId={liquidacion.id} />
        </div>

    </div>
  ) 
}
