import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import type { Liquidacion } from "../../../types"
import LiquidacionesCardMobile from "./LiquidacionesCardMobile"

type EstadoAccordionProps = {
    estado: string
    liquidaciones:Liquidacion[]
    isExpanded: boolean
    onToggle: () => void
}

const formatoEstados: { [key: string]: string } = {
    BORRADOR: 'Borrador',
    EN_REVISION: 'En Revisión',
    APROBADA: 'Aprobada',
    PAGADA: 'Pagada',
    CANCELADA: 'Cancelada',
};

const coloresEstados: { [key: string]: { bg: string; text: string; emoji: string } } = {
    BORRADOR:    { bg: 'bg-slate-100 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-300', emoji: '🔘' },
    EN_REVISION: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', emoji: '🟡' },
    APROBADA:    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', emoji: '🔵' },
    PAGADA:      { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', emoji: '🟢' },
    CANCELADA:   { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', emoji: '🔴' },
};


export default function EstadoAccordion({estado, liquidaciones, isExpanded, onToggle}: EstadoAccordionProps) {

    const uiColors = coloresEstados[estado];

    const liquidacionesOrdenadas = [...liquidaciones].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    
    return (
        <div className=" mb-4">
            <button
                onClick={onToggle}
                className={` w-full flex items-center justify-between p-3 rounded-lg ${uiColors.bg} transition-all duration-200 active:scale-98`}
                id={`estado-${estado}`}
            >
                <div className=" flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronDownIcon className={` w-5 h-5 ${uiColors.text} transition-transform duration-300`} />
                    ) : (
                        <ChevronRightIcon className={` w-5 h-5 ${uiColors} transition-transform duration-300`} />
                    )}
                    <span className=" text-lg">{uiColors.emoji}</span>
                    <span className={`font-bold text-sm uppercase tracking-wide ${uiColors.text}}`}>{formatoEstados[estado]}</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-white/60 dark:bg-gray-900/60 ${uiColors.text}`}>{liquidaciones.length}</span>
                </div>
            </button>
            <div className={` overflow-hidden transition-all duration-300 ease-in-out ${ isExpanded ? 'max-h-[10000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-2">
                    {liquidacionesOrdenadas.map(liquidacion => (

                        <LiquidacionesCardMobile 
                            key={liquidacion.id}
                            liquidacion={liquidacion}             
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
