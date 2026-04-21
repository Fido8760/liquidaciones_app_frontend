import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProgramacionStats } from "../../types";
import { formatDateOnly } from "../../utils/formatDate";

type ProgramacionStatsPanelProps = {
    stats: ProgramacionStats;
};



const STATUS_COLORS: Record<string, string> = {
    SIN_ASIGNAR: "#6b7280",
    ASIGNADO: "#f59e0b",
    SALIO: "#16a34a",
    CANCELADO: "#dc2626",
    PRINCIPAL: "#2563eb", 
};

const STATUS_LABELS: Record<string, string> = {
    SIN_ASIGNAR: "No asignados",
    ASIGNADO: "Asignados",
    SALIO: "Realizadas",
    CANCELADO: "Canceladas",
};

export default function ProgramacionStatsPanel({ stats }: ProgramacionStatsPanelProps) {

    const cards = [
        { label: "Total salidas", value: stats.total_salidas, color: "text-blue-600" },
        { label: "No Asignados", value: stats.sin_asignar, color: "text-gray-600" },
        { label: "Asignados", value: stats.asignados, color: "text-amber-600" },
        { label: "Realizadas", value: stats.realizadas, color: "text-green-600" },
        { label: "Canceladas", value: stats.canceladas, color: "text-red-600" },
    ];

    // 🔥 Filtrar ceros para el pie
    const pieData = stats.por_estatus.filter(item => item.total > 0);

    const total = pieData.reduce((acc, item) => acc + item.total, 0);

    return (
        <section className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">
                    Estadísticas del Histórico
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Resumen visual de la programación en el rango seleccionado.
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
                {cards.map((card) => (
                    <article key={card.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{card.label}</p>
                        <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </article>
                ))}

                <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Cumplimiento</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.cumplimiento}%</p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Salidas realizadas contra el total del periodo.
                    </p>
                </article>
            </div>

            {/* GRÁFICAS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                
                {/* BARRAS POR DÍA */}
                <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Salidas por día</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.por_dia}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                <XAxis 
                                    dataKey="fecha" 
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => formatDateOnly(value.split('T')[0])} 
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="total" fill={STATUS_COLORS.PRINCIPAL} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                {/* PIE CHART */}
                <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">
                        Distribución por estatus
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="total"
                                    nameKey="estatus"
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    label={({ name, value }) => {
                                        const percent = ((value / total) * 100).toFixed(0);
                                        return `${STATUS_LABELS[name!] || name}: ${percent}%`;
                                    }}
                                >
                                    {pieData.map((entry) => (
                                        <Cell
                                            key={entry.estatus}
                                            fill={STATUS_COLORS[entry.estatus] || "#000"}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value, name) => {
                                        const safeValue = Number(value ?? 0);
                                        const percent = total ? ((safeValue / total) * 100).toFixed(2) : "0";

                                        return [
                                            `${safeValue} (${percent}%)`,
                                            STATUS_LABELS[name as string] || name
                                        ];
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </article>
            </div>

            {/* RESTO */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* CANCELACIONES */}
                <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Cancelaciones por motivo</h3>
                    {stats.por_motivo_cancelacion.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No hay cancelaciones en el rango seleccionado.
                        </p>
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.por_motivo_cancelacion} layout="vertical" margin={{ left: 24 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis type="category" dataKey="motivo" width={140} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="total" fill={STATUS_COLORS.CANCELADO} radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </article>

                {/* CLIENTES */}
                <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Top clientes</h3>
                    {stats.por_cliente.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No hay salidas registradas en el rango seleccionado.
                        </p>
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.por_cliente}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis dataKey="cliente" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="total" fill={STATUS_COLORS.PRINCIPAL} radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}