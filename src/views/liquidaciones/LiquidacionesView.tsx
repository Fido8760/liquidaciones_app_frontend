import { useQuery } from "@tanstack/react-query"
import { getLiquidacionesList } from "../../api/liquidaciones/LiquidacionAPI"
import { useSearchParams } from "react-router-dom"
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorQuery from "../../components/ui/ErrorQuery";
import LiquidacionesFilters from "../../components/liquidaciones/liquiaciones-lista/LiquidacionesFilters";
import LiquidacionesListado from "../../components/liquidaciones/liquiaciones-lista/LiquidacionesListado";
import LiquidacionesPaginacion from "../../components/liquidaciones/liquiaciones-lista/LiquidacionesPaginacion";


const LIMIT = 10;

export default function LiquidacionesView() {
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 1);
    const operadorId = searchParams.get('operadorId') ?? undefined;
    const unidadId = searchParams.get('unidadId') ?? undefined
    const folio = searchParams.get('folio') ?? undefined;
    const fechaInicio = searchParams.get('fechaInicio') ?? undefined;
    const fechaFin = searchParams.get('fechaFin') ?? undefined;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['liquidaciones-lista', { page, operadorId, unidadId, folio, fechaInicio, fechaFin }],
        queryFn: () => getLiquidacionesList({ page, limit: LIMIT, operadorId, unidadId, folio, fechaInicio, fechaFin }),
        placeholderData: (prev) => prev
    })
    

    if (isLoading) return <LoadingSpinner fullScreen mensaje="Cargando liquidaciones..." />
    if (isError) return <ErrorQuery mensaje="Error al cargar las liquidaciones." />
    if(data) return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className=" flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">Liquidaciones</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        {data.total} liquidaciones encontradas
                    </p>
                </div>
            </div>

            <LiquidacionesFilters />
            <LiquidacionesListado liquidaciones={data.liquidaciones} />
            <LiquidacionesPaginacion total={data.total} limit={LIMIT} />
        </div>
    )
}
