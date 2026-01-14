import { isAxiosError } from "axios";
import api from "../lib/axios";
import { costoFleteResponseSchema, type CostoFleteFormData } from "../types";

export async function createCostoflete(formData: CostoFleteFormData) {
    try {
        const url = `/costo-fletes`;
        const { data } = await api.post<CostoFleteFormData>(url, formData);
        return data;
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function getCostoFleteById(costoId: number) {
    const url = `/costo-fletes/${costoId}`
    try {
        const { data } = await api(url)
        const response = costoFleteResponseSchema.safeParse(data)
        if( response.success ) {
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

type UpdateFleteParams = {
    liquidacionId: number;
    costoId: number;
    formData: CostoFleteFormData;
}

export async function updateFlete({ formData, costoId }: UpdateFleteParams) {
    try {
        const url = `/costo-fletes/${costoId}`
        const { data } = await api.put(url, formData)
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

export async function deleteFlete(costoId: number) {
    const url = `/costo-fletes/${costoId}`
    try {
        const { data } = await api.delete<string>(url)
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
