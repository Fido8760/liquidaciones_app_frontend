import { formatCurrency } from "../../../utils/formatCurrency";

interface FinancialRowProps {
    label: string;
    amount: number;
    isBold?: boolean;
    large?: boolean;
    isNegative?: boolean;
    className?: string;
}

export default function FinancialRow({ label, amount, isBold, large, isNegative, className }: FinancialRowProps) {
    return (
        <div className={`flex justify-between items-center ${large ? 'text-lg' : 'text-sm'}`}>
            <span className={`${isBold ? 'font-semibold' : 'font-normal'} text-gray-700 dark:text-gray-300`}>
                {label}
            </span>
            <span className={`${isBold ? 'font-bold' : 'font-medium'} ${
                className || (isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white')
            }`}>
                {isNegative ? '-' : ''}{formatCurrency(amount)}
            </span>
        </div>
    );
}