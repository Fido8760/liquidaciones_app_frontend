import type { Liquidacion } from "../types";
import { comisionDefaultUnidad } from "../utils/comisionDefault";


export const useRendimientoInfo = (liquidacion: Liquidacion) => {
    const hasRendimientoTabulado =
        liquidacion.rendimiento_tabulado !== null && liquidacion.rendimiento_tabulado > 0;

    const tieneAhorroDiesel = liquidacion.diesel_a_favor_sin_iva > 0;
    const tieneExcesoDiesel = liquidacion.diesel_en_contra_sin_iva > 0;
    const tieneAjusteRendimiento = tieneAhorroDiesel || tieneExcesoDiesel;

    const tieneAjusteManual = Number(liquidacion.ajuste_manual) !== 0;

    const porcentajeDefault = comisionDefaultUnidad(liquidacion.unidad.tipo_unidad);
    const porcentajeActual = Number(liquidacion.comision_porcentaje);

    const tieneComisionAjustada = porcentajeActual !== porcentajeDefault;

    const comisionFinal = Number(liquidacion.comision_estimada);

    const rendimietoInfo = {
        tipo: tieneAhorroDiesel ? 'ahorro' : tieneExcesoDiesel ? 'exceso' : null,
        monto: tieneAhorroDiesel
            ? liquidacion.diesel_a_favor_sin_iva
            : liquidacion.diesel_en_contra_sin_iva,
        mensaje: tieneAhorroDiesel
            ? 'El operador ahorró combustible'
            : 'El operador excedió el consumo esperado'
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
};
