import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { fleteSchema, type Flete, type FleteForm } from "../../types";

export async function createCostoflete(formData: FleteForm) {
    try {
        const url = `/fletes`;
        const { data } = await api.post<Flete>(url, formData);
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
    const url = `/fletes/${costoId}`
    try {
        const { data } = await api(url)
        const response = fleteSchema.safeParse(data)
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
    formData: FleteForm;
}

export async function updateFlete({ formData, costoId }: UpdateFleteParams) {
    try {
        const url = `/fletes/${costoId}`
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

export async function deleteFlete(fleteId: number) {
    const url = `/fletes/${fleteId}`
    try {
        const { data } = await api.delete<{message:string}>(url)
        return data.message
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}
