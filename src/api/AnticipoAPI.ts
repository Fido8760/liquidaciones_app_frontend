import { isAxiosError } from "axios"
import api from "../lib/axios"
import { anticipoResponseSchema, type AnticipoFormData } from "../types"

export async function createAnticipo(formData: AnticipoFormData) {
    try {
        const url = '/anticipos'
        const { data } = await api.post<AnticipoFormData>(url, formData)
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

export async function getAnticipoById(anticipoId: number) {
    try {
        const url = `/anticipos/${anticipoId}`
        const { data } = await api(url)
        const response = anticipoResponseSchema.safeParse(data)
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


type UpdateAnticipoParams = {
    liquidacionId: number;
    anticipoId: number;
    formData: AnticipoFormData;
}

export async function updateAnticipo({formData, anticipoId} : UpdateAnticipoParams) {
    try {
        const url = `/anticipos/${anticipoId}`
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

export async function deleteAnticipo(anticipoId: number) {
    const url = `/anticipos/${anticipoId}`
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