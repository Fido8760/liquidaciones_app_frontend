import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import type { Deduccion, Liquidacion } from "../../../../types";
import StatCard from "../shared/StatCard";
import { formatCurrency } from "../../../../utils/formatCurrency";

type ResumenMovimientosProps = {
    liquidacion: Liquidacion;
    totalAnticipos: number;
    deduccionesAgrupadas: Record<Deduccion['tipo'], number>;
};

export default function ResumenMovimientos({ liquidacion, totalAnticipos, deduccionesAgrupadas }: ResumenMovimientosProps) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-600 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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
                
                {totalAnticipos > 0 && (
                    <StatCard
                        label="Total de Anticipos"
                        value={formatCurrency(totalAnticipos)}
                    />
                )}

                {Object.entries(deduccionesAgrupadas).map(([tipo, monto]) => (
                    <StatCard
                        key={tipo}
                        label={`Deducción (${tipo})`}
                        value={formatCurrency(monto)}
                    />
                ))}
            </div>
        </section>
    );
}