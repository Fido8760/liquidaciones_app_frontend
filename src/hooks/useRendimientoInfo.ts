import type { Liquidacion } from "../types";

export const useRendimientoInfo = (liquidacion: Liquidacion) => {
    const hasRendimientoTabulado = liquidacion.rendimiento_tabulado !== null && liquidacion.rendimiento_tabulado > 0;
    const tieneAhorroDiesel = liquidacion.diesel_a_favor_sin_iva > 0;
    const tieneExcesoDiesel = liquidacion.diesel_en_contra_sin_iva > 0;
    const tieneAjusteRendimiento = tieneAhorroDiesel || tieneExcesoDiesel;

    const tieneAjusteManual = liquidacion.ajuste_manual !== 0;

    const tieneComisionAjustada = liquidacion.comision_pagada !== null && Math.abs(liquidacion.comision_pagada - liquidacion.comision_estimada) > 0.01;
    const comisionFinal = liquidacion.comision_pagada !== null ? liquidacion.comision_pagada : liquidacion.comision_estimada;
    const rendimietoInfo = {
        tipo: tieneAhorroDiesel ? 'ahorro' : tieneExcesoDiesel ? 'exceso' : null,
        monto: tieneAhorroDiesel ? liquidacion.diesel_a_favor_sin_iva : liquidacion.diesel_en_contra_sin_iva,
        mensaje: tieneAhorroDiesel ? 'El operador ahorró combustible' : 'Eñ operador excedió el consumo esperado'
    };

    return {
        hasRendimientoTabulado,
        tieneAhorroDiesel,
        tieneExcesoDiesel,
        tieneAjusteRendimiento,
        tieneAjusteManual,
        tieneComisionAjustada,
        comisionFinal,
        rendimietoInfo
    };
}