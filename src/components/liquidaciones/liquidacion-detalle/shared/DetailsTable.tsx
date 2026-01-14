import type { TableItem } from "../../../../types"

export default function DetailsTable({ title, items }: { title: string; items: TableItem[] }) {
     if (!items || items.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400">No hay registros para mostrar.</p>
            </div>
        );
    }
    const headers = Object.keys(items[0]).filter(key => key !== 'id');

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{title}</h3>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>{headers.map(key => <th key={key} scope="col" className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</th>)}</tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <tr key={item.id}>
                                {headers.map(header => (
                                    <td key={header} className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                        {/* @ts-ignore */}
                                        {header === 'evidencia' && String(item[header]).startsWith('http') ? <a href={String(item[header])} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver Evidencia</a> : String(item[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
