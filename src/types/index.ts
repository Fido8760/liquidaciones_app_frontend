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

// Creamos un Tipo de TypeScript basado en el objeto de arriba
export type EstadoLiquidacion = (typeof EstadoLiquidacion)[keyof typeof EstadoLiquidacion];

export const unidadSchema = z.object({
    id: z.number(),
    no_unidad: z.string(),
    tipo_unidad: z.string(),
    u_placas: z.string()
})

export const unidadesSchema = z.object({
    unidades: z.array(unidadSchema),
    total: z.number()
})

export type Unidades = z.infer<typeof unidadesSchema>

export const operadorSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    apellido_p: z.string(),
    apellido_m: z.string()
})

export const operadoresSchema = z.object({
    operadores: z.array(operadorSchema),
    total: z.number()
})

export type Operadores = z.infer<typeof operadoresSchema>

export const gastoCombustibleSchema = z.object({
    id: z.number(),
    litros: z.string().transform(Number),
    precio_litro: z.string().transform(Number),
    monto: z.string().transform(Number),
    metodo_pago: z.enum(["EFECTIVO", "TARJETA"]),
    evidencia: z.string().nullable(),
});

export type GastoCombustible = z.infer<typeof gastoCombustibleSchema>
export type GastoCombustibleForm = Pick<GastoCombustible, 'litros' | 'metodo_pago' | 'precio_litro' | 'monto' >
export type GastoCombustibleFormData = GastoCombustibleForm & {
    evidencia?: FileList
    liquidacionId: number;
};

export const gastoCombustibleResponseSchema = z.object({
  id: z.number(),
  litros: z.string(),
  precio_litro: z.string(),
  monto: z.string(),
  metodo_pago: z.enum(["EFECTIVO", "TARJETA"]),
  evidencia: z.string().nullable(),
  liquidacion: z.object({
    id: z.number(),
    fecha_fin: z.string(),
    fecha_llegada: z.string(),
    fecha_inicio: z.string(),
    rendimiento: z.string(),
    kilometros_recorridos: z.string(),
    cliente: z.string(),
    folio_liquidacion: z.string(),
    estado: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    total_combustible: z.string(),
    total_casetas: z.string(),
    total_gastos_varios: z.string(),
    total_costo_fletes: z.string(),
  }),
});

export type GastoCombustibleResponse = z.infer<typeof gastoCombustibleResponseSchema>


export const gastoCasetaSchema = z.object({
    id: z.number(),
    monto: z.string().transform(Number),
    metodo_pago_caseta: z.enum(["EFECTIVO", "IAVE/TAG"]),
    evidencia: z.string()
});

export type GastoCaseta = z.infer<typeof gastoCasetaSchema>
export type GastoCasetaForm = Pick<GastoCaseta, 'monto' | 'metodo_pago_caseta' >
export type GastoCasetaFormData = GastoCasetaForm & {
    evidencia?: FileList
    liquidacionId: number;
}

export const gastoCasetaResponseSchema = z.object({
    id: z.number(),
    monto: z.string(),
    metodo_pago_caseta: z.enum(["EFECTIVO", "IAVE/TAG"]),
    evidencia: z.string().nullable(),
    liquidacion: z.object({
        id: z.number(),
        fecha_fin: z.string(),
        fecha_llegada: z.string(),
        fecha_inicio: z.string(),
        rendimiento: z.string(),
        kilometros_recorridos: z.string(),
        cliente: z.string(),
        folio_liquidacion: z.string(),
        estado: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        total_combustible: z.string(),
        total_casetas: z.string(),
        total_gastos_varios: z.string(),
        total_costo_fletes: z.string(),
    }),
});

export const gastoVarioSchema = z.object({
    id: z.number(),
    concepto: z.string(),
    monto: z.string().transform(Number),
    observaciones: z.string().nullable(),
    evidencia: z.string()
});

export type GastoVario = z.infer<typeof gastoVarioSchema>
export type GastoVarioForm = Pick<GastoVario, 'concepto' | 'monto' | 'observaciones' >
export type GastoVarioFormData = GastoVarioForm & {
    evidencia?: FileList
    liquidacionId: number;
}

export const gastoVariosResponseSchema = z.object({
    id: z.number(),
    monto: z.string(),
    concepto: z.string(),
    observaciones: z.string(),
    evidencia: z.string().nullable(),
    liquidacion: z.object({
        id: z.number(),
        fecha_fin: z.string(),
        fecha_llegada: z.string(),
        fecha_inicio: z.string(),
        rendimiento: z.string(),
        kilometros_recorridos: z.string(),
        cliente: z.string(),
        folio_liquidacion: z.string(),
        estado: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        total_combustible: z.string(),
        total_casetas: z.string(),
        total_gastos_varios: z.string(),
        total_costo_fletes: z.string(),
    }),
});

export const costoFleteSchema = z.object({
    id: z.number(),
    monto: z.string().transform(Number),
    descripcion: z.string()
});

export type CostoFlete = z.infer<typeof costoFleteSchema>
export type CostoFleteForm = Pick<CostoFlete, 'monto' | 'descripcion' >
export type CostoFleteFormData = CostoFleteForm & {
    liquidacionId: number;
}

export const costoFleteResponseSchema = z.object({
    id: z.number(),
    monto: z.string().transform(Number),
    descripcion: z.string(),
    liquidacion: z.object({
        id: z.number(),
        fecha_fin: z.string(),
        fecha_llegada: z.string(),
        fecha_inicio: z.string(),
        rendimiento: z.string(),
        kilometros_recorridos: z.string(),
        cliente: z.string(),
        folio_liquidacion: z.string(),
        estado: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        total_combustible: z.string(),
        total_casetas: z.string(),
        total_gastos_varios: z.string(),
        total_costo_fletes: z.string(),
    }),
})


export const deduccionSchema = z.object({
    id: z.number(),
    tipo: z.enum(['SEGURO', 'MANIOBRA', 'REPARTO', 'OTROS', 'ESTADIAS']),
    monto: z.string().transform(Number)
});

export type Deduccion = z.infer<typeof deduccionSchema>
export type DeduccionForm = Pick<Deduccion, 'tipo' | 'monto'>
export type DeduccionFormData = DeduccionForm & {
    liquidacionId: number
}

export const deduccionResponseSchema = z.object({
    id: z.number(),
    monto: z.string().transform(Number),
    tipo: z.enum(['SEGURO', 'MANIOBRA', 'REPARTO', 'OTROS', 'ESTADIAS']),
    liquidacion: z.object({
        id: z.number(),
        fecha_fin: z.string(),
        fecha_llegada: z.string(),
        fecha_inicio: z.string(),
        rendimiento: z.string(),
        kilometros_recorridos: z.string(),
        cliente: z.string(),
        folio_liquidacion: z.string(),
        estado: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        total_combustible: z.string(),
        total_casetas: z.string(),
        total_gastos_varios: z.string(),
        total_costo_fletes: z.string(),
    }),
})

export const anticipoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['ANTICIPO', 'GIRO']),
    monto: z.string().transform(Number)
});

export type Anticipo = z.infer<typeof anticipoSchema>
export type AnticipoForm = Pick<Anticipo, 'tipo' | 'monto'>
export type AnticipoFormData = AnticipoForm & {
    liquidacionId: number
}

export const anticipoResponseSchema = z.object({
    id: z.number(),
    monto: z.string().transform(Number),
    tipo: z.enum(['ANTICIPO', 'GIRO']),
    liquidacion: z.object({
        id: z.number(),
        fecha_fin: z.string(),
        fecha_llegada: z.string(),
        fecha_inicio: z.string(),
        rendimiento: z.string(),
        kilometros_recorridos: z.string(),
        cliente: z.string(),
        folio_liquidacion: z.string(),
        estado: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        total_combustible: z.string(),
        total_casetas: z.string(),
        total_gastos_varios: z.string(),
        total_costo_fletes: z.string(),
    }),
})


export const liquidacionSchema = z.object({
    id: z.number(),
    unidad: unidadSchema,
    operador: operadorSchema,
    usuario_creador: userSchema,
    usuario_editor: userSchema.optional().nullable(),
    usuario_aprobador: userSchema.optional().nullable(),
    usuario_pagador: userSchema.optional().nullable(),
    fecha_pago: z.string().nullable().optional(), 
    fecha_fin: z.string(),
    fecha_llegada: z.string(),
    fecha_inicio: z.string(),
    rendimiento: z.string().transform(Number),
    rendimiento_ajustado: z.string().transform(Number),
    kilometros_recorridos: z.string().transform(Number),
    cliente: z.string(),
    folio_liquidacion: z.string(),
    estado: z.enum(["BORRADOR", "EN_REVISION", "APROBADA", "PAGADA", "CANCELADA"]),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    notas: z.array(notaSchema).optional(),
    gastos_combustible: z.array(gastoCombustibleSchema).optional(),
    gastos_caseta: z.array(gastoCasetaSchema).optional(),
    gastos_varios: z.array(gastoVarioSchema).optional(),
    costos_fletes: z.array(costoFleteSchema).optional(),
    deducciones: z.array(deduccionSchema).optional(),
    anticipos: z.array(anticipoSchema).optional(),
    total_combustible: z.string().transform(Number),
    total_casetas: z.string().transform(Number),
    total_gastos_varios: z.string().transform(Number),
    total_costo_fletes: z.string().transform(Number),
    total_deducciones_comerciales: z.string().transform(Number),
    total_bruto: z.string().transform(Number),
    total_neto_pagar: z.string().transform(Number),
    utilidad_viaje: z.string().transform(Number),
    comision_porcentaje: z.string().transform(Number),
    ajuste_manual: z.string().transform(Number),
    motivo_ajuste: z.string().nullable().optional(),
});

export type Liquidacion = z.infer<typeof liquidacionSchema>

export const liquidacionesSchema = z.object({
    liquidaciones: z.array(liquidacionSchema),
    total: z.number()
})

export type AjustarFormData = Pick<Liquidacion, 'rendimiento_ajustado' | 'comision_porcentaje' | 'ajuste_manual' | 'motivo_ajuste'>
export type TableItem = GastoCombustible | GastoCaseta | GastoVario | CostoFlete | Deduccion | Anticipo;

/** Para el formulario de creación de liquidación */

export const liquidacionFormSchema = z.object({
    unidadId: z.number(),
    operadorId: z.number(),
    fecha_fin: z.string(),
    fecha_llegada: z.string(),
    fecha_inicio: z.string(),
    rendimiento: z.preprocess((val) => Number(val), z.number()),
    kilometros_recorridos: z.preprocess((val) => Number(val), z.number()),
    cliente: z.string(),
    folio_liquidacion: z.string(),

})

export type LiquidacionFormData = z.infer<typeof liquidacionFormSchema>