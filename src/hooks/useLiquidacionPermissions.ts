import { EstadoLiquidacion, type Liquidacion } from "../types";
import { useAuth } from "./useAuth"

export const useLiquidacionPermissions = (liquidacion: Liquidacion) => {
    const { data: user } = useAuth();

    const isSistemas = user?.rol === 'SISTEMAS';
    const isCapturista = user?.rol === 'CAPTURISTA';

    const estadosBloqueados: EstadoLiquidacion[] = [
        EstadoLiquidacion.APROBADA,
        EstadoLiquidacion.PAGADA,
        EstadoLiquidacion.CANCELADA,
    ];
    const estadoPermiteEdicion = !estadosBloqueados.includes(liquidacion.estado);

    const rolPermiteEdicon = isCapturista || isSistemas;

    const canEdit = (rolPermiteEdicon && estadoPermiteEdicion) || isSistemas;

    return {
        canEdit,
        isSistemas,
        isCapturista
    };
};