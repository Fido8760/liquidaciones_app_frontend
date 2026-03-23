import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { gastoSchema, tipoGastosActivosSchema, type Gasto, type TipoGasto } from "../../types";

export async function getTipoGastosActivos(): Promise<TipoGasto[]> {
    try {
        const { data } = await api.get('/tipo-gastos/activos');
        const response = tipoGastosActivosSchema.safeParse(data);
        if(!response.success) {
            throw new Error('Error en la estructura de datos');
        }
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function createGasto(formData: FormData): Promise<Gasto> {
    try {
        const { data } = await api.post('/gastos', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error.response.data.message)
            throw new Error(error.response.data.message);
            
        }
        throw new Error('Error desconocido');
    }
}

export async function getGastoById(gastoId: Gasto['id']): Promise<Gasto> {
    try {
        const { data } = await api.get(`/gastos/${gastoId}`);
        const response = gastoSchema.safeParse(data);
        if(!response.success) {
            throw new Error('Error en la estructura de datos');
        }

        return response.data;
    } catch (error) {
         if (isAxiosError(error) && error.response) {
            console.log(error.response.data.message)
            throw new Error(error.response.data.message);
            
        }
        throw new Error('Error desconocido');
    }
}

type UpdateGastoParams = {
    gastoId: Gasto['id'];
    formData: FormData;
}

export async function updateGsto({gastoId, formData}: UpdateGastoParams): Promise<Gasto> {
    try {
        const { data } = await api.patch(`/gastos/${gastoId}`, formData);
        return data
    } catch (error) {
         if (isAxiosError(error) && error.response) {
            console.log(error.response.data.message)
            throw new Error(error.response.data.message);
            
        }
        throw new Error('Error desconocido');
    }
}

export async function deleteGasto(gastoId: number) {
    const url = `/gastos/${gastoId}`;
    try {
        const { data } = await api.delete<{message: string}>(url);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message;
            throw new Error(errorMessage);
        }
        throw new Error("Error desconocido");
    }
}