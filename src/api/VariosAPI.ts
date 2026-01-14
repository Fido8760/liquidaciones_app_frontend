import { isAxiosError } from "axios";
import api from "../lib/axios";
import imageCompression from 'browser-image-compression';

import { gastoVariosResponseSchema, type GastoVarioFormData } from "../types";

export async function createGastoVarios(formData: FormData): Promise<GastoVarioFormData> {
    try {
        const url = '/gasto-varios'
        const { data } = await api.post(url, formData)
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

export async function getVariosById(variosId: number) {
    const url = `/gasto-varios/${variosId}`
    try {

        const { data } = await api(url)
        const response = gastoVariosResponseSchema.safeParse(data)
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

type UpdateVariosParams = {
    liquidacionId: number;
    variosId: number;
    formData: GastoVarioFormData;
}

export async function updateVarios({ formData, variosId} :  UpdateVariosParams) {
    try {
        const url = `/gasto-varios/${variosId}`
        const dataToSend = new FormData()

        dataToSend.append('monto', String(formData.monto))
        dataToSend.append('concepto', String(formData.concepto))
        dataToSend.append('observaciones', String(formData.observaciones))
        
        if( formData.evidencia && formData.evidencia.length > 0) {
            const imageFile = formData.evidencia[0]
            const  compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight:1280,
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

export async function deleteVarios(variosId: number) {
    const url = `/gasto-varios/${variosId}`

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