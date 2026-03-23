
type ModalTipoGastoProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    nombre: string;
    setNombre: (nombre: string) => void;
    isPending: boolean;
    editando: boolean;
};

export default function ModalTipoGasto({ isOpen, onClose, onSubmit, nombre, setNombre, isPending, editando }: ModalTipoGastoProps) {
    if(!isOpen) return null;
    return (
        <div className=' fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className=' bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4'>
                <h2 className=' text-lg font-bold text-gray-900 dark:text-white mb-4'>Nueno Tipo de gasto</h2>
                <div className='mb-4'>
                    <label className=' block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>Nombre</label>
                    <input 
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder='Ej. CASETAS'
                        className=' w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500' 
                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                        autoFocus
                    />
                </div>
                <div className=' flex justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className=' px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors'
                    >Cancelar</button>
                    <button
                        onClick={onSubmit}
                        className=' px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:bg-gray-400'
                    >{isPending ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}</button>
                </div>
            </div>
        </div>
    )
}
