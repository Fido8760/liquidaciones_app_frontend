import { useAuth } from "../../../hooks/useAuth";
import { useRendimientoInfo } from "../../../hooks/useRendimientoInfo";
import ResumenMovimientos from "./resumen/ResumenMovimientos";
import InformacionViaje from "./resumen/InformacionViaje";
import DetalleFletes from "./resumen/DetalleFletes";
import DesgloceFinanciero from "./resumen/DesgloceFinanciero";
import EstadoPago from "./resumen/EstadoPago";
import { useMemo, useState } from "react";

import ModalAjustarLiquidacion from "./resumen/ModalAjustarLiquidacion";
import type { Liquidacion } from "../../../types";

const getTotalAnticipos = (liquidacion: Liquidacion): number => {
    return (liquidacion.anticipos ?? []).reduce((sum, item) => sum + item.monto, 0);
};



type ResumenTabProps = {
    liquidacion: Liquidacion;
};

export default function ResumenTab({ liquidacion }: ResumenTabProps) {
    const { data: user } = useAuth();
    const [isModalAjustarOpen, setIsModalAjustarOpen] = useState(false);
    const totalAnticipos = useMemo(() => getTotalAnticipos(liquidacion), [liquidacion]);
    const { tieneAhorroDiesel, tieneExcesoDiesel, tieneAjusteRendimiento, tieneAjusteManual, tieneComisionAjustada, comisionFinal } = useRendimientoInfo(liquidacion);
    const canViewFinancials = ['DIRECTOR', 'ADMIN', 'SISTEMAS'].includes(user?.rol || '');

    return (
        <div className="space-y-6">
            <ResumenMovimientos 
                liquidacion={liquidacion}
                totalAnticipos={totalAnticipos}
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
            
                </>
            )}
            
            <EstadoPago liquidacion={liquidacion} />

            {/* Modal de ajustar */}
            {isModalAjustarOpen && (
                <ModalAjustarLiquidacion 
                    liquidacion={liquidacion}
                    onClose={() => setIsModalAjustarOpen(false)}
                />
            )}
        </div>
    );
}