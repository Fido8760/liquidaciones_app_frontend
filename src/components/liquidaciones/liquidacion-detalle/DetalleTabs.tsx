import { ClipboardDocumentListIcon, FireIcon, TicketIcon, BriefcaseIcon, TruckIcon, MinusCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const TABS = [
    { id: 'resumen', label: 'Resumen General', icon: ClipboardDocumentListIcon },
    { id: 'gastos_combustible', label: 'Gastos de Combustible', icon: FireIcon },
    { id: 'gastos_casetas', label: 'Gastos de Casetas', icon: TicketIcon },
    { id: 'gastos_varios', label: 'Gastos de Viaje', icon: BriefcaseIcon },
    { id: 'ingresos', label: 'Fletes', icon: TruckIcon },
    { id: 'deducciones', label: 'Deducciones', icon: MinusCircleIcon },
    { id: 'anticipos', label: 'Anticipos', icon: CurrencyDollarIcon },
];

type DetalleTabsProps = {
    activeTab: string;
    onTabClick: (tabId: string) => void;
};

export default function DetalleTabs({ activeTab, onTabClick }: DetalleTabsProps) {
    return (
        <>
            <div className="block md:hidden mb-4">
                <label 
                    htmlFor="tab-select"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Sección
                </label>
                <select
                    id="tab-select"
                    value={activeTab}
                    onChange={(e) => onTabClick(e.target.value)}
                    className="w-full p-2 rounded-lg border-gray-300 dark:border-gray-600
                               dark:bg-gray-700 dark:text-white
                               focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    aria-label="Seleccionar sección de la liquidación" 
                >
                    {TABS.map(tab => (
                        <option key={tab.id} value={tab.id}>
                            {tab.label}
                        </option>
                    ))}
                </select>
            </div>

            <nav className="-mb-px hidden md:flex space-x-6 overflow-x-auto">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`
                                group flex items-center gap-2 py-3 px-1 border-b-2
                                text-sm font-medium whitespace-nowrap
                                transition-all duration-300
                                ${
                                    isActive
                                        ? 'border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-fuchsia-500'
                                }
                            `}
                        >
                            <Icon
                                className={`
                                    w-4 h-4 transition-transform duration-300
                                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                                `}
                            />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
