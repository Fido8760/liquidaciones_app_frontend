import {  z } from 'zod';

/** Auth Users */

const authSchema = z.object({
    nombre: z.string(),
    apellido: z.string(),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    rol: z.enum(['CAPTURISTA', 'ADMIN', 'DIRECTOR', 'SISTEMAS']),
    token: z.string().nullable()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'confirmPassword'>
export type ConfirmToken = Pick<Auth, 'token'>

/** Users */
export const userSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    apellido: z.string(),
    email: z.email(),
    rol: z.enum(['CAPTURISTA', 'ADMIN', 'DIRECTOR', 'SISTEMAS']),
    activo: z.boolean().optional(),
    createdAt: z.string().optional(),
});
export type User = z.infer<typeof userSchema>

export const userResponseSchema = z.object({
    total: z.number(),
    users: z.array(userSchema)
})

export type UsersResponse = z.infer<typeof userResponseSchema>
export type UserFormData = Pick<Auth, 'nombre' | 'apellido' | 'email' | 'password' | 'confirmPassword' | 'rol'>;
export type UserState = Pick<User, 'activo'>;

/** Notas */

export const notaSchema =  z.object({
    id: z.number(),
    contenido: z.string(),
    createdAt: z.string(),
    usuario: userSchema.pick({
        id: true,
        nombre: true,
        apellido: true,
        email: true
    })
})

export type Nota = z.infer<typeof notaSchema>
export type NotaFormData = Pick<Nota, 'contenido'>

/** liquidaciones */

export const EstadoLiquidacion = {
    BORRADOR: 'BORRADOR',
    EN_REVISION: 'EN_REVISION',
    APROBADA: 'APROBADA',
    PAGADA: 'PAGADA',
    CANCELADA: 'CANCELADA',
} as const;

export type EstadoLiquidacion = (typeof EstadoLiquidacion)[keyof typeof EstadoLiquidacion];

// 🎯 ENUM para resultado de rendimiento
export const ResultadoRendimiento = {
    FAVOR: 'FAVOR',
    CONTRA: 'CONTRA',
    NEUTRO: 'NEUTRO',
} as const;

export type ResultadoRendimiento = (typeof ResultadoRendimiento)[keyof typeof ResultadoRendimiento];

export const unidadSchema = z.object({
    id: z.number(),
    no_unidad: z.string(),
    tipo_unidad: z.string(),
    u_placas: z.string()
})

export const unidadesSchema = z.object({
    unidades: z.array(unidadSchema),
    total: z.number()
});

export type Unidad = z.infer<typeof unidadSchema>;
export type Unidades = z.infer<typeof unidadesSchema>;

export const operadorSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    apellido_p: z.string(),
    apellido_m: z.string()
});

export const operadoresSchema = z.object({
    operadores: z.array(operadorSchema),
    total: z.number()
});

export type Operador = z.infer<typeof operadorSchema>;
export type Operadores = z.infer<typeof operadoresSchema>;

// ═══════════════════════════════════════════════════
// GASTOS
// ═══════════════════════════════════════════════════

export const gastoCombustibleSchema = z.object({
    id: z.number(),
    litros: z.string().transform(Number),
    precio_litro: z.string().transform(Number),
    monto: z.string().transform(Number),
    metodo_pago: z.enum(["EFECTIVO", "TARJETA"]),
    evidencia: z.string().nullable(),
    deletedAt: z.string().nullable().optional(),
});

export type GastoCombustible = z.infer<typeof gastoCombustibleSchema>;
export type GastoCombustibleForm = Pick<GastoCombustible, 'metodo_pago' | 'precio_litro' | 'monto'>;
export type GastoCombustibleFormData = GastoCombustibleForm & {
    evidencia?: FileList;
    liquidacionId: number;
};

export const tipoGastoSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    activo: z.boolean()
});
export type TipoGasto = z.infer<typeof tipoGastoSchema>;

export const tipoGastosActivosSchema = z.array(tipoGastoSchema)

export const tiposGastosSchema = z.object({
    data: z.array(tipoGastoSchema),
    total: z.number(),
})

export const gastoSchema = z.object({
    id: z.number(),
    tipo_gasto: tipoGastoSchema,
    monto: z.string().transform(Number),
    descripcion: z.string(). nullable(),
    afecta_operador: z.boolean(),
    evidencia: z.string().nullable(),
    createdAt: z.string(),
    deletedAt: z.string().nullable().optional()
})
export type Gasto = z.infer<typeof gastoSchema>;
export type GastoFormData = {
    tipoGastoId: number;
    monto: number,
    descripcion?: string,
    afecta_operador?: boolean;
    evidencia?: FileList;
    liquidacionId: number;
}

export const fleteSchema = z.object({
    id: z.number(),
    cliente: z.string(),
    monto: z.string().transform(Number),
    origen: z.string().nullable(),
    destino: z.string().nullable(),
    descripcion: z.string()
});

export type Flete = z.infer<typeof fleteSchema>;
export type FleteForm = Pick<Flete, 'monto' | 'descripcion' | 'origen' | 'destino' | 'cliente'>;
export type FleteFormData = FleteForm & {
    liquidacionId: number;
};


export const anticipoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['ANTICIPO', 'GIRO']),
    monto: z.string().transform(Number),
    deletedAt: z.string().nullable().optional(),
});

export type Anticipo = z.infer<typeof anticipoSchema>;
export type AnticipoForm = Pick<Anticipo, 'tipo' | 'monto'>;
export type AnticipoFormData = AnticipoForm & {
    liquidacionId: number;
};

// ═══════════════════════════════════════════════════
// LIQUIDACIÓN PRINCIPAL
// ═══════════════════════════════════════════════════

export const liquidacionSchema = z.object({
    id: z.number(),
    unidad: unidadSchema,
    operador: operadorSchema,
    usuario_creador: userSchema,
    usuario_editor: userSchema.nullable().optional(),
    usuario_aprobador: userSchema.nullable().optional(),
    usuario_pagador: userSchema.nullable().optional(),
    usuario_modificador_total: userSchema.nullable().optional(),
    folio_liquidacion: z.string(),
    fecha_inicio: z.string(),
    fecha_fin: z.string(),
    fecha_llegada: z.string(),
    fecha_pago: z.string().nullable().optional(),
    fecha_modificacion_total: z.string().nullable().optional(), 
    kilometros_recorridos: z.string().transform(Number),
    rendimiento_tabulado: z.string().transform(Number),
    rendimiento_real: z.string().transform(Number).nullable(),
    diesel_a_favor_sin_iva: z.string().transform(Number),
    diesel_en_contra_sin_iva: z.string().transform(Number),
    resultado_rendimiento: z.enum(["FAVOR", "CONTRA", "NEUTRO"]),
    total_fletes: z.string().transform(Number),
    total_combustible: z.string().transform(Number),
    total_gastos: z.string().transform(Number),
    total_gastos_empresa: z.string().transform(Number),
    total_bruto: z.string().transform(Number),
    total_neto_sugerido: z.string().transform(Number).nullable(),
    total_neto_pagar: z.string().transform(Number),
    total_modificado_manualmente: z.boolean(),                  
    utilidad_viaje: z.string().transform(Number),
    comision_porcentaje: z.string().transform(Number),
    gasto_ferry: z.string().transform(Number),
    comision_estimada: z.string().transform(Number),
    comision_pagada: z.string().transform(Number).nullable(),
    ajuste_manual: z.string().transform(Number),
    motivo_ajuste: z.string().nullable().optional(),
    estado: z.enum(["BORRADOR", "EN_REVISION", "APROBADA", "PAGADA", "CANCELADA"]),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    gastos_combustible: z.array(gastoCombustibleSchema).optional().default([]),
    gastos: z.array(gastoSchema).optional().default([]),
    fletes: z.array(fleteSchema).optional().default([]),
    anticipos: z.array(anticipoSchema).optional().default([]),
    notas: z.array(notaSchema).optional().default([]),
});

export type Liquidacion = z.infer<typeof liquidacionSchema>;

export const liquidacionesSchema = z.object({
    liquidaciones: z.array(liquidacionSchema),
    total: z.number()
});

export type Liquidaciones = z.infer<typeof liquidacionesSchema>;

// ═══════════════════════════════════════════════════
// FORM TYPES (para React Hook Form)
// ═══════════════════════════════════════════════════
export type AjustarFormData = Pick<Liquidacion, 'rendimiento_tabulado' | 'comision_porcentaje' | 'ajuste_manual' | 'motivo_ajuste' | 'gasto_ferry'>

export type LiquidacionFormData = {
    unidadId: number;
    operadorId: number;
    fecha_inicio: string;
    fecha_llegada: string;
    fecha_fin: string;
    rendimiento_tabulado: number;
    kilometros_recorridos: number;
    folio_liquidacion: string;
};

export type ModificarTotalFormData = {
    total_neto_pagar: number;
};

export type TableItem = GastoCombustible | Gasto | Flete | Anticipo;