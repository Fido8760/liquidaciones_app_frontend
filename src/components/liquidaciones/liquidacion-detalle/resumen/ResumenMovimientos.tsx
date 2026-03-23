import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import type { Liquidacion } from "../../../../types";
import StatCard from "../shared/StatCard";
import { formatCurrency } from "../../../../utils/formatCurrency";

type ResumenMovimientosProps = {
    liquidacion: Liquidacion;
    totalAnticipos: number;
};

export default function ResumenMovimientos({ liquidacion, totalAnticipos }: ResumenMovimientosProps) {
    const totalGastosOperador = liquidacion.total_gastos - liquidacion.total_gastos_empresa;
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                Resumen de Movimientos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Ingresos (Fletes)" 
                    value={formatCurrency(liquidacion.total_fletes)} 
                />
                <StatCard 
                    label="Combustible" 
                    value={formatCurrency(liquidacion.total_combustible)} 
                />
                {liquidacion.total_gastos_empresa > 0 && (
                    <StatCard 
                        label="Gastos Empresa" 
                        value={formatCurrency(liquidacion.total_gastos_empresa)} 
                    />
                )}

                {totalGastosOperador > 0 && (
                    <StatCard 
                        label="Cargos al operador"
                        value={formatCurrency(totalGastosOperador)}
                    />

                )}
                {liquidacion.gasto_ferry > 0 && (
                    <StatCard 
                        label="Ferry"
                        value={formatCurrency(liquidacion.gasto_ferry)}
                    />
                )}
                
                {totalAnticipos > 0 && (
                    <StatCard
                        label="Total de Anticipos"
                        value={formatCurrency(totalAnticipos)}
                    />
                )}

            </div>
        </section>
    );
}