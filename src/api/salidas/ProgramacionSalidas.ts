import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { programacionSalidasArraySchema, programacionSalidasResponseSchema, programacionSalidaSchema, programacionStatsSchema, type CambiarEstatusForm, type CancelarProgramacionForm, type CreateProgramacionSalidaForm, type ProgramacionHistoricoFilters, type ProgramacionSalida, type ProgramacionSalidasResponse, type ProgramacionStats, type UpdateProgramacionSalidaForm } from "../../types";


export async function getProgramacionHoy(fecha?: string) {
    try {
        const { data } = await api('/programacion-salidas/dia', {
            params: fecha ? { fecha } : undefined
        });
        const response = programacionSalidasArraySchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
        console.error('❌ Zod ProgramacionHoy:', response.error.format());
        throw new Error('Error en la estructura de datos');
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function getProgramacionHistorico(filters: ProgramacionHistoricoFilters = {}): Promise<ProgramacionSalidasResponse> {
    try {
        const query = buildQueryString(filters);
        const url = query ? `/programacion-salidas?${query}` : '/programacion-salidas';
        const { data } = await api(url);
        const response = programacionSalidasResponseSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
        console.error('❌ Zod ProgramacionHistorico:', response.error.format());
        throw new Error('Error en la estructura de datos');
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function getProgramacionSalida(id: number) {
    try {
        const { data } = await api(`/programacion-salidas/${id}`);
        const response = programacionSalidaSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
        console.error('❌ Zod ProgramacionSalida:', response.error.format());
        throw new Error('Error en la estructura de datos');
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function crearProgramacion(formData: CreateProgramacionSalidaForm): Promise<ProgramacionSalida> {
    try {
        const { data } = await api.post('/programacion-salidas', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function editarProgramacion({ id, dto }: { id: number; dto: UpdateProgramacionSalidaForm }): Promise<ProgramacionSalida> {
    try {
        const { data } = await api.put(`/programacion-salidas/${id}`, dto);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function cambiarEstatus({ id, dto }: { id: number; dto: CambiarEstatusForm }): Promise<ProgramacionSalida> {
    try {
        const { data } = await api.patch(`/programacion-salidas/${id}/estatus`, dto);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function cancelarProgramacion({ id, dto }: { id: number; dto: CancelarProgramacionForm }): Promise<ProgramacionSalida> {
    try {
        const { data } = await api.patch(`/programacion-salidas/${id}/cancelar`, dto);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function getProgramacionStats(filters: ProgramacionHistoricoFilters = {}): Promise<ProgramacionStats> {
    try {
        const query = buildQueryString(filters);
        const url = query ? `/programacion-salidas/stats?${query}` : '/programacion-salidas/stats';
        const { data } = await api(url);
        const response = programacionStatsSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
        console.error('❌ Zod ProgramacionStats:', response.error.format());
        throw new Error('Error en la estructura de datos');
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

export async function eliminarProgramacion(id: number) {
    try {
        const { data } = await api.delete(`/programacion-salidas/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error desconocido');
    }
}

type AsignarUnidadForm = {
  unidadId: number;
};

export async function asignarUnidad({ id, dto, }: { id: number; dto: AsignarUnidadForm; }): Promise<ProgramacionSalida> {
  try {
    const { data } = await api.patch( `/programacion-salidas/${id}/asignar-unidad`, dto );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error desconocido');
  }
}

function buildQueryString(filters: ProgramacionHistoricoFilters = {}) {
    const params = new URLSearchParams();

    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    return params.toString();
}
