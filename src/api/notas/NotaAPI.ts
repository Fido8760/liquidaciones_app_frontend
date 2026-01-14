import { isAxiosError } from "axios";
import type { Liquidacion, NotaFormData } from "../../types";
import api from "../../lib/axios";

type NoteAPIType = {
    formData: NotaFormData,
    liquidacionId: Liquidacion['id']
}

export async function createNote({liquidacionId, formData}: NoteAPIType) {
    try {
        const url = `/liquidaciones/${liquidacionId}/notas`;
        const { data } = await api.post<{message: string}>(url, formData);
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