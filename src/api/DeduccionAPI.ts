import { isAxiosError } from "axios"
import api from "../lib/axios"
import { deduccionSchema, type DeduccionFormData } from "../types"

export async function createDeduccion(formData: DeduccionFormData) {
    try {
        const url = `/deduccion-flete`
        const { data } = await api.post<DeduccionFormData>(url, formData)
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

export const getDeduccionById = async (deduccionId : number ) => {
    const url = `/deduccion-flete/${deduccionId}`
    try {
        const { data } = await api(url)
        const response =  deduccionSchema.safeParse(data)
        if (response.success) {
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

type UpdateDeducionParams = {
    liquidacionId: number;
    deduccionId: number;
    formData: DeduccionFormData;
}

export async function updateDeducion({formData, deduccionId} : UpdateDeducionParams) {
    try {
        const url = `/deduccion-flete/${deduccionId}`
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

export async function deleteDeduccion(deduccionId: number) {
    const url = `/deduccion-flete/${deduccionId}`
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