import { isAxiosError } from "axios";
import api from "../lib/axios";
import { gastoCasetaSchema, type GastoCasetaFormData } from "../types";
import imageCompression from 'browser-image-compression';

export async function createGastoCaseta(formData: FormData): Promise<GastoCasetaFormData> {
    try {
        const url = `/gasto-casetas`;
        const { data } = await api.post<GastoCasetaFormData>(url, formData);
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

export async function getCasetaById(casetaId: number) {
    const url = `/gasto-casetas/${casetaId}`
    try {
        const { data } = await api(url)
        const response = gastoCasetaSchema.safeParse(data)
        if( response.success) {
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

type UpdateCasetasParams = {
    liquidacionId: number;
    casetaId: number;
    formData: GastoCasetaFormData;
}

export async function updateCaseta({formData, casetaId}: UpdateCasetasParams) {
    try {
        const url =`/gasto-casetas/${casetaId}`
        const dataToSend = new FormData();

        dataToSend.append('monto', String(formData.monto))
        dataToSend.append('metodo_pago_caseta', formData.metodo_pago_caseta)

        if(formData.evidencia && formData.evidencia.length > 0) {
            const imageFile = formData.evidencia[0]
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: 'image/webp' 
            })

            const webpFile = new File([compressedFile], 'evidencia.webp', { type: 'image/webp'})
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

export async function deleteCaseta(casetaId: number) {
    const url = `/gasto-casetas/${casetaId}`
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