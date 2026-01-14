import { isAxiosError } from "axios";
import api from "../lib/axios";
import { gastoCombustibleResponseSchema, type GastoCombustible, type GastoCombustibleFormData } from "../types";
import imageCompression from 'browser-image-compression';

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
        const response = gastoCombustibleResponseSchema.safeParse(data)
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
    liquidacionId: number;
    combustibleId: number;
    formData: GastoCombustibleFormData;
}; 

export async function updateCombustible({formData, combustibleId}: UpdateCombustibleParams) {
    try {
        const url = `/gasto-combustible/${combustibleId}`
        const dataToSend = new FormData();

        dataToSend.append('litros', String(formData.litros));
        dataToSend.append('precio_litro', String(formData.precio_litro));
        dataToSend.append('monto', String(formData.monto));
        dataToSend.append('metodo_pago', formData.metodo_pago);

        if (formData.evidencia && formData.evidencia.length > 0) {
            const imageFile = formData.evidencia[0]

            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: 'image/webp'
            })

            const webpFile = new File([compressedFile], 'evidencia.webp', { type: 'image/webp' })

            dataToSend.append('file', webpFile)
        } 

        const { data } = await api.put(url, dataToSend)
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
        throw new Error("Error desconocido")
        
    }
}