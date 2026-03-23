import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { gastoCombustibleSchema, type GastoCombustible, } from "../../types";

export async function createGastoCombustible(formData: FormData): Promise<GastoCombustible> {
    try {
        const url = `/gasto-combustible`;
        const { data } = await api.post<GastoCombustible>(url, formData);
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

export async function getCombustiblebyId(combustibleId: number) {
    const url = `/gasto-combustible/${combustibleId}`
    
    try {
        const { data } = await api(url)
        const response = gastoCombustibleSchema.safeParse(data)
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

type UpdateCombustibleParams = {
    combustibleId: number;
    formData: FormData;
}; 

export async function updateCombustible({formData, combustibleId}: UpdateCombustibleParams) {
    try {
        const { data } = await api.put(`/gasto-combustible/${combustibleId}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Error desconocido");
    }
}

export async function deleteCombustible(combustibleId: number) {
    const url = `/gasto-combustible/${combustibleId}`
    
    try {
        const { data } = await api.delete<{message: string}>(url)
        return data
        
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido");
        
    }
}