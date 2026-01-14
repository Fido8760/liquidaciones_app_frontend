import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BanknotesIcon, BuildingOfficeIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CurrencyDollarIcon, ExclamationTriangleIcon, TruckIcon, UserIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../../hooks/useAuth";
import { EstadoLiquidacion, type Deduccion, type Liquidacion } from "../../../types"
import { formatCurrency } from "../../../utils/formatCurrency"
import { formatDateTime } from "../../../utils/formatDate";
import InfoItem from "./InfoItem";
import StatCard from "./shared/StatCard"
import FinancialRow from "./FinancialRow";

const getTotalAnticipos = (liquidacion: Liquidacion): number => {
    return (liquidacion.anticipos ?? []).reduce((sum, item) => sum + item.monto, 0);
};

const getDeduccionesAgrupadas = (liquidacion: Liquidacion): Record<Deduccion['tipo'], number> => {
    return (liquidacion.deducciones ?? []).reduce((acc, deduccion) => {
        if (!acc[deduccion.tipo]) {
            acc[deduccion.tipo] = 0;
        }
        acc[deduccion.tipo] += deduccion.monto;
        return acc;
    }, {} as Record<Deduccion['tipo'], number>);
};


type ResumenTabProps = {
    liquidacion: Liquidacion;
};

export default function ResumenTab({ liquidacion }: ResumenTabProps) {

    const { data: user } = useAuth();

    // --- Obtenemos los datos calculados ---
    const totalAnticipos = getTotalAnticipos(liquidacion);
    const deduccionesAgrupadas = getDeduccionesAgrupadas(liquidacion);
    const ingresoReal = liquidacion.total_costo_fletes -liquidacion.total_deducciones_comerciales;
    const gastosOperativos = liquidacion.total_combustible + liquidacion.total_casetas + liquidacion.total_gastos_varios;
    const comisionMonto = liquidacion.total_bruto * (liquidacion.comision_porcentaje / 100)

     // ⚠️ PERMISOS
    const canViewFinancials = ['DIRECTOR', 'ADMIN', 'SISTEMAS'].includes(user?.rol || '');

    return (
        <div className="space-y-6">
            {/* --- SECCIÓN 1: Tarjetas de Estadísticas (Ingresos y Egresos) --- */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4">
                    Información del Viaje
                </h2>
                <div className=" p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                    <dl className=" grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        <InfoItem 
                            label="Unidad / Placas / Tipo Unidad" 
                            value={`${liquidacion.unidad.no_unidad} / ${liquidacion.unidad.u_placas} / ${liquidacion.unidad.tipo_unidad}`}
                            icon={<TruckIcon className=" w-5 h-5 text-gray-500" />}
                        />
                        <InfoItem 
                            label="Operador" 
                            value={`${liquidacion.operador.nombre} ${liquidacion.operador.apellido_p} ${liquidacion.operador.apellido_m}`}
                            icon={<UserIcon className=" w-5 h-5 text-gray-500" />}
                        />
                        <InfoItem 
                            label="Cliente" 
                            value={`${liquidacion.cliente}`} 
                            icon={<BuildingOfficeIcon className=" w-5 h-5 text-gray-500" />}
                        />
                        <InfoItem 
                            label="Fecha Inicio" 
                            value={formatDateTime(liquidacion.fecha_inicio)}
                            icon={<CalendarIcon className=" w-5 h-5 text-gray-500" />}
                        />
                        <InfoItem 
                            label="Fecha Fin" 
                            value={formatDateTime(liquidacion.fecha_fin)}
                            icon={<CalendarIcon className=" w-5 h-5 text-gray-500" />} 
                        />
                        <InfoItem 
                            label="Fecha Llegada" 
                            value={formatDateTime(liquidacion.fecha_llegada)} 
                            icon={<CalendarIcon className=" w-5 h-5 text-gray-500" />} 
                        />
                        <InfoItem 
                            label="Kilometros Recorridos" 
                            value={`${liquidacion.kilometros_recorridos.toLocaleString('es-MX')} km`} 
                            highlight 
                        />
                        <InfoItem 
                            label="Rendimiento" 
                            value={`${liquidacion.rendimiento.toFixed(2) } km/l`} 
                            highlight 
                        />
                        {liquidacion.rendimiento_ajustado > 0 && (
                            <InfoItem 
                                label="Rendimiento Ajustado" 
                                value={`${liquidacion.rendimiento_ajustado.toFixed(2)} km/l `} 
                                highlight 
                                className=" text-green-600 dark:text-green-400"
                            />
                        )}
                    </dl>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    Resumen de Movimientos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        label="Ingresos (Fletes)" 
                        value={formatCurrency(liquidacion.total_costo_fletes)} 
                    />
                    <StatCard 
                        label="Egresos (Combustible)" 
                        value={formatCurrency(liquidacion.total_combustible)} 
                    />
                    <StatCard 
                        label="Egresos (Casetas)" 
                        value={formatCurrency(liquidacion.total_casetas)} 
                    />
                    <StatCard 
                        label="Egresos (Gastos Varios)" 
                        value={formatCurrency(liquidacion.total_gastos_varios)} 
                    />
                    
                    {/* Anticipos */}
                    {totalAnticipos > 0 && (
                        <StatCard
                            label="Total de Anticipos"
                            value={formatCurrency(totalAnticipos)}
                        />
                    )}

                    {/* Deducciones por tipo */}
                    {Object.entries(deduccionesAgrupadas).map(([tipo, monto]) => (
                        <StatCard
                            key={tipo}
                            label={`Deducción (${tipo})`}
                            value={formatCurrency(monto)}
                        />
                    ))}
                </div>
            </section>

            {canViewFinancials && (

                <section>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                        <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        Resumen Financiero
                    </h2>

                    <div className=" mb-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center gap-2 text-lg">
                            <ArrowTrendingUpIcon className="w-6 h-6" />
                            Ingresos
                        </h3>
                        <div className=" space-y-3">
                            <FinancialRow label="Flete Facturado" amount={liquidacion.total_costo_fletes} />
                            {liquidacion.total_deducciones_comerciales > 0 && (
                                <FinancialRow 
                                    label="Menos: Deducciones Comerciales"
                                    amount={liquidacion.total_deducciones_comerciales}
                                    isNegative
                                />
                            )}
                            <div className=" border-t border-green-300 dark:border-green-700 pt-2 mt-2">
                                <FinancialRow 
                                    label="Ingreso Real"
                                    amount={ingresoReal}
                                    isBold
                                    large
                                    className=" text-green-700 dark:text-green-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" mb-6 p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                        <h3 className=" font-semibold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2 text-lg">
                            <ArrowTrendingDownIcon className=" w-6 h-6"/>
                            Gastos Operativos
                        </h3>
                        <div className=" space-y-3">
                            <FinancialRow label="Combustible" amount={liquidacion.total_combustible} />
                            <FinancialRow label="Casetas" amount={liquidacion.total_casetas} />
                            <FinancialRow label="Gastos Varios" amount={liquidacion.total_gastos_varios} />
                            <div className=" border-t border-red-300 dark:border-red-700 pt-2 mt-2">
                                <FinancialRow 
                                    label="Total Gastos"
                                    amount={gastosOperativos}
                                    isBold
                                    large
                                    className=" text-red-700 dark:text-red-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                        <div className=" flex items-center justify-between">
                            <h3 className=" font-semibold text-blue-900 dark:text-blue-300 text-lg flex items-center gap-2">
                                <ChartBarIcon className=" w-6 h-6"/>
                                Utilidad Bruta
                            </h3>
                            <div className=" text-right">
                                <p className=" text-3xl font-bold text-blue-700 dark:text-blue-400">
                                    {formatCurrency(liquidacion.total_bruto)}
                                </p>
                                <p className=" text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Ingreso Real - Gastos Operativos
                                </p>
                            </div>
                        </div>
                    </div>

                    {liquidacion.comision_porcentaje > 0 && (
                        <div className=" mb-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                            <h3 className=" font-semibold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2 text-lg">
                                <UserIcon className=" w-6 h-6" />
                                Comisión Operador
                            </h3>
                            <div className=" space-y-3">
                                <div className=" flex justify-between items-center text-sm">
                                    <span className=" text-gray-700 dark:text-gray-300">Prcentaje Acordado</span>
                                    <span className=" font-bold text-purple-700 dark:text-purple-400 text-lg" >{liquidacion.comision_porcentaje}%</span>
                                </div>
                                <FinancialRow label="Comisión Ganada" amount={comisionMonto} isBold />
                                {totalAnticipos > 0 && (
                                    <FinancialRow label="Menos: Anticipos" amount={totalAnticipos} isNegative />
                                )}
                                {liquidacion.ajuste_manual !== 0 && (
                                    <>
                                        <FinancialRow 
                                            label={`${liquidacion.ajuste_manual > 0 ? 'Menos' : 'Más'}: Ajuste Manual`}
                                            amount={Math.abs(liquidacion.ajuste_manual)}
                                            isNegative={liquidacion.ajuste_manual > 0}
                                        />
                                        {liquidacion.motivo_ajuste &&  (
                                            <p className=" text-xs text-gray-600 dark:text-gray-400 italic pl-4">
                                                Motivo: {liquidacion.motivo_ajuste}
                                            </p>
                                        )}
                                    </>
                                )}
                                <div className=" border-t-2 border-purple-300 dark:border-purple-700 pt-3 mt-3">
                                    <FinancialRow 
                                        label="Total neto a pagar"
                                        amount={liquidacion.total_neto_pagar}
                                        isBold
                                        large
                                        className={liquidacion.total_neto_pagar >= 0 
                                            ? " text-purple-700 dark:text-purple-400"
                                            : "text-red-700 dark:text-red-400"
                                        }
                                    />
                                </div>
                                {liquidacion.total_neto_pagar < 0 && (
                                    <div>
                                        <ExclamationTriangleIcon className=" w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 "/>
                                        <p className="text-sm text-red-800 dark:text-red-300">
                                            <strong>El operador debe {formatCurrency(Math.abs(liquidacion.total_neto_pagar))} a la empresa</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className=" p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-400 dark:border-indigo-600">
                        <div className=" flex items-center justify-between">
                            <h3 className=" font-semibold text-indigo-900 dark:text-indigo-300 text-lg flex items-center gap-2">
                                <BanknotesIcon className=" w-6 h-6"/>
                                Utilidad
                            </h3>
                            <div className=" text-right">
                                <p className=" text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                                    {formatCurrency(liquidacion.utilidad_viaje)}
                                </p>
                                <p className=" text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Utilidad Bruta - Comisión
                                </p>
                            </div>
                        </div>
                    </div>
                        <div className=" mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                            <h3 className=" text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Documentos y Reportes</h3>
                            <div className=" flex flex-col sm:flex-row gap-3">
                                <button
                                    disabled
                                    className=" inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 font-medium px-6 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-not-allowed transition-all"
                                    title="Próximamente disponible"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Generar PDF para Firma</span>
                                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                        Próximamente
                                    </span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                💡 El PDF incluirá todos los detalles de la liquidación para la firma física del operador.
                            </p>
                        </div>
                </section>
            )}

            {liquidacion.estado === EstadoLiquidacion.PAGADA && (
                <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-800 p-3 rounded-full">
                        <CheckCircleIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            Liquidación Pagada
                        </h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-500">
                            Pagada por: <b>{liquidacion.usuario_pagador?.nombre} {liquidacion.usuario_pagador?.apellido}</b> 
                            <br/> 
                            Fecha: {liquidacion.fecha_pago ? new Date(liquidacion.fecha_pago).toLocaleDateString('es-MX', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            }) : 'N/A'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}