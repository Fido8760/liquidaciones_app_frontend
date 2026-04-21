import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate, useSearchParams } from "react-router-dom";

type LiquidacionesPaginacionProps = {
    total: number;
    limit: number;
}

export default function LiquidacionesPaginacion({total, limit}: LiquidacionesPaginacionProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentPage = Number(searchParams.get('page') ?? 1);
    const totalPages = Math.ceil(total / limit);
    
    if(totalPages <= 1) return null

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        navigate(`?${params.toString()}`);
    }

    const getPages = () => {
        const delta = 2;
        const range: number[] = [];

        for(let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            range.push(i);
        }
        return range;
    }

    const pages = getPages();
    const showLeftEllipsis = pages[0] > 2;
    const showRightEllipsis = pages[pages.length - 1] < totalPages - 1;
    return ( 
        <div className=" flex items-center justify-between mt-6 pb-4">
            <p className=" text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Página {currentPage} de {totalPages} - {total} resultados 
            </p>
            <div className=" flex items-center gap-1 mx-auto sm:mx-0">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className=" flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeftIcon className=" w-4 h-4"/>
                    <span className="hidden sm:inline">Anterior</span>
                </button>
                {pages[0] > 1 && (
                    <button
                        onClick={() => goToPage(1)}
                    >1</button>
                )}
                {showLeftEllipsis && (
                    <span className=" px-2 text-gray-400 dark:text-gray-500">...</span>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={` px-3 py-1.5 text-sm rounded-lg border transition-all ${ page === currentPage ? ' bg-purple-600 border-purple-600 text-white font-medium' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400'}`}
                    >{page}</button>
                ))}

                {showRightEllipsis && (
                    <span className=" px-2 text-gray-400 dark:text-gray-500">...</span>
                )}

                {pages[pages.length -1] < totalPages && (
                    <button
                        onClick={() => goToPage(totalPages)}
                        className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                    >
                        {totalPages}
                    </button>
                )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
