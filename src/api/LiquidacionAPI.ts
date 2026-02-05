import { isAxiosError } from "axios";
import api from "../lib/axios";
import { liquidacionesSchema, liquidacionSchema, operadoresSchema, unidadesSchema, type AjustarFormData, type Liquidacion, type LiquidacionFormData, type ModificarTotalFormData } from "../types";


export async function getUnidades() {

    try {
        const { data } = await api('/unidades')
        const response = unidadesSchema.safeParse(data)
        if(response.success) {
            return response.data
        }

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function getOperadores() {

    try {
        const { data } = await api('/operadores')
        const response = operadoresSchema.safeParse(data)
        if(response.success) {
            return response.data
        }

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function createLiquidacion(formData: LiquidacionFormData) {

    try {
        const { data } = await api.post('/liquidaciones', formData)
        return data
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function getLiquidaciones() {

    try {
        const { data } = await api('/liquidaciones');
        const response = liquidacionesSchema.safeParse(data)
        if(response.success) {
            return response.data
        } else {
            // --- ESTO ES LO QUE NECESITAMOS VER ---
            console.error("❌ Error de validación Zod:", response.error.format());
            // También puedes ver la data cruda para comparar
            console.log("🔍 Data recibida del Backend:", data);
            
            throw new Error("Error en la validación de los datos");
        }

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function getLiquidacionById(liquidacionId: number) {
    const url = `/liquidaciones/${liquidacionId}`
    try {
        const { data } = await api(url)
        const response = liquidacionSchema.safeParse(data)
        if(response.success) {
            return response.data
        }  else {
            // --- AQUÍ ESTÁ EL TRUCO PARA EL DEBUGGING ---
            // Imprimimos en consola qué campo falló exactamente
            console.error("❌ Zod Error en getLiquidacionById:", response.error.format());
            console.log("🔍 Datos recibidos:", data);

            // IMPORTANTE: Lanzar error para que React Query sepa que falló
            // y no devuelva undefined.
            throw new Error("Error en la estructura de datos de la liquidación");
        }

    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

type UpdateLiquidacionParams = {
    liquidacionId: number
    formData: LiquidacionFormData
}

export async function updateLiquidacion({ liquidacionId, formData }: UpdateLiquidacionParams) : Promise<Liquidacion> {
    const url = `/liquidaciones/${liquidacionId}`
    try {
        const { data } = await api.put(url, formData)
        return data

    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al enviar las instrucciones")
        
    }
}

export async function deleteLiquidacion(liquidacionId: number) {
    const url = `/liquidaciones/${liquidacionId}`
    try {
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al actualizar el estado de la liquidación")
        
    }
}


type UpdateStatusParams = {
    liquidacionId: Liquidacion['id'];
    status: Liquidacion['estado'];
}

export async function updateStatus({liquidacionId, status} : UpdateStatusParams) {
    try {
        const url = `/liquidaciones/${liquidacionId}/estado`;
        const { data } = await api.patch<{message: string}>(url, {estado: status});
        return data;
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al actualizar el estado de la liquidación")
        
    }
}

type AjusteLiquidacionParams = {
    formData: AjustarFormData,
    liquidacionId: Liquidacion['id']
}

export async function ajusteLiquidacion({formData, liquidacionId}: AjusteLiquidacionParams ) {
    try {
        const url = `/liquidaciones/${liquidacionId}/ajustar`;
        const { data } = await api.patch<{message: string}>(url, formData);
        return data;
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al ajustar la liquidación")
        
    }
}

type ModificarTotalPagoParams = {
    liquidacionId: number;
    formData: ModificarTotalFormData;
};

export async function modificarTotalPago({ liquidacionId, formData }: ModificarTotalPagoParams) {
    try {
        const { data } = await api.patch<{ message: string }>(
            `/liquidaciones/${liquidacionId}/modificar-total-pago`,
            formData
        );
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message;
            throw new Error(errorMessage);
        }
    throw new Error("Error al modificar el total del pago");
    
    }
}


