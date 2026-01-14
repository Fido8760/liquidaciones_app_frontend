import { CheckCircleIcon, CurrencyDollarIcon, XCircleIcon, ArrowPathIcon, PlayCircleIcon, BanknotesIcon } from "@heroicons/react/20/solid";

// 1. Agregamos REABRIR a los tipos
type ActionType = 'FINALIZAR' | 'PAGAR' | 'RECHAZAR' | 'SOLICITAR_REVISION' | 'FORZAR' | 'REABRIR' | 'AJUSTAR';

interface LiquidacionActionBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    typeAction: ActionType; 
}

export default function LiquidacionActionBtn({ typeAction, children, className, ...props }: LiquidacionActionBtnProps) {

    const styles = {
        FINALIZAR: {
            classes: "bg-purple-600 hover:bg-purple-700 text-white",
            icon: <CheckCircleIcon className="w-5 h-5" />
        },
        PAGAR: {
            classes: "bg-emerald-600 hover:bg-emerald-700 text-white",
            icon: <CurrencyDollarIcon className="w-5 h-5" />
        },
        RECHAZAR: {
            classes: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200",
            icon: <XCircleIcon className="w-5 h-5" />
        },
        SOLICITAR_REVISION: {
            classes: "bg-blue-600 hover:bg-blue-700 text-white",
            icon: <PlayCircleIcon className="w-5 h-5" />
        },
        FORZAR: {
            classes: "bg-gray-800 text-white hover:bg-gray-900 uppercase text-xs",
            icon: <ArrowPathIcon className="w-4 h-4" />
        },
        // 2. Definimos el estilo ÁMBAR aquí adentro
        REABRIR: {
            classes: "bg-amber-600 hover:bg-amber-700 text-white",
            icon: <ArrowPathIcon className="w-5 h-5" />
        },

        AJUSTAR: {
            classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
            icon: <BanknotesIcon className=" w-5 h-5" />
        }

    };

    const currentStyle = styles[typeAction];

    return (
        <button
            {...props}
            // Concatenamos strings simples (más seguro si no usas overrides externos conflictivos)
            className={`
                ${currentStyle.classes} 
                px-4 py-2 rounded-lg font-bold shadow-md transition-all duration-200 
                flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${className || ''} 
            `}
        >
            {currentStyle.icon}
            <span>{children}</span>
        </button>
    );
}