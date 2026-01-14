
type InfoItemProps = {
    label: string;
    value: string;
    highlight?: boolean;
    className?: string;
    icon?: React.ReactNode
}

export default function InfoItem({ label, value, highlight, className, icon }: InfoItemProps) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                {icon}
                {label}
            </dt>
            <dd className={`mt-1 font-semibold ${
                highlight 
                    ? className || 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white'
            }`}>
                {value}
            </dd>
        </div>
    );
}
