import { isAxiosError } from "axios";
import api from "../../../lib/axios";
import { tiposGastosSchema, type TipoGasto } from "../../../types";

export async function getTipoGastos() {
    try {
        const { data } = await api('/tipo-gastos');
        const response = tiposGastosSchema.safeParse(data);
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

export async function createTipoGasto(nombre: string) {
    try {
        const { data } = await api.post<TipoGasto>('/tipo-gastos', { nombre });
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function updateTipoGasto({id, nombre}: {id: number; nombre: string}) {
    try {
        const { data } = await api.put<TipoGasto>(`/tipo-gastos/${id}`, { nombre });
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function toggleActivoTipoGasto(id:number) {
    try {
        const { data } = await api.patch<TipoGasto>(`/tipo-gastos/${id}/toggle-activo`);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function deleteTipoGasto(id: number) {
    try {
        const { data } = await api.delete<{ message: string }>(`/tipo-gastos/${id}`);
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}