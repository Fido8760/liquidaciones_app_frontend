import { useAuth } from "../../../hooks/useAuth";
import { useRendimientoInfo } from "../../../hooks/useRendimientoInfo";
import ResumenMovimientos from "./resumen/ResumenMovimientos";
import InformacionViaje from "./resumen/InformacionViaje";
import DetalleFletes from "./resumen/DetalleFletes";
import DesgloceFinanciero from "./resumen/DesgloceFinanciero";
import SinRendimientoBanner from "./resumen/SinRendimientoBanner";
import EstadoPago from "./resumen/EstadoPago";
import { useMemo } from "react";
import type { Deduccion, Liquidacion } from "../../../types";

const getTotalAnticipos = (liquidacion: Liquidacion): number => {
    return (liquidacion.anticipos ?? []).reduce((sum, item) => sum + item.monto, 0);
};

const getDeduccionesAgrupadas = (liquidacion: Liquidacion): Record<Deduccion['tipo'], number> => {
    return (liquidacion.deducciones ?? []).reduce((acc, deduccion) => {
        if (!acc[deduccion.tipo]) {
            acc[deduccion.tipo] = 0;
        }
        acc[deduccion.tipo] += deduccion.monto;
        return acc;
    }, {} as Record<Deduccion['tipo'], number>);
};

type ResumenTabProps = {
    liquidacion: Liquidacion;
};

export default function ResumenTab({ liquidacion }: ResumenTabProps) {

    const { data: user } = useAuth();
    const totalAnticipos = useMemo(() => getTotalAnticipos(liquidacion), [liquidacion]);
    const deduccionesAgrupadas = useMemo(() => getDeduccionesAgrupadas(liquidacion), [liquidacion]);

    const { hasRendimientoTabulado, tieneAhorroDiesel, tieneExcesoDiesel, tieneAjusteRendimiento, tieneAjusteManual, tieneComisionAjustada, comisionFinal } = useRendimientoInfo(liquidacion)
    const canViewFinancials = ['DIRECTOR', 'ADMIN', 'SISTEMAS'].includes(user?.rol || '');

     return (
        <div className="space-y-6">
            <ResumenMovimientos 
                liquidacion={liquidacion}
                totalAnticipos={totalAnticipos}
                deduccionesAgrupadas={deduccionesAgrupadas}
            />

            <InformacionViaje 
                liquidacion={liquidacion}
                canViewFinancials={canViewFinancials}
            />

            {canViewFinancials && (
                <>
                    <DetalleFletes 
                        liquidacion={liquidacion}
                    />

                    {hasRendimientoTabulado ? (
                        <DesgloceFinanciero 
                            liquidacion={liquidacion}
                            totalAnticipos={totalAnticipos}
                            comisionFinal={comisionFinal}
                            tieneComisionAjustada={tieneComisionAjustada}
                            tieneAjusteRendimiento={tieneAjusteRendimiento}
                            tieneAhorroDiesel={tieneAhorroDiesel}
                            tieneExcesoDiesel={tieneExcesoDiesel}
                            tieneAjusteManual={tieneAjusteManual}
                        />
                    ) : (
                        <SinRendimientoBanner />
                    )}
                </>
            )}
            <EstadoPago liquidacion={liquidacion} />
        </div>
    );
}