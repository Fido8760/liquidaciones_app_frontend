type SubmitButtonProps = {
    isPending: boolean;
    label?: string;
    pendingLabel?: string;
}

export default function SubmitButton({ isPending, label = 'Agregar', pendingLabel = 'Guardando...' }: SubmitButtonProps) {
    return (
        <input
            type="submit"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors disabled:bg-gray-400 rounded-md"
            value={isPending ? pendingLabel : label}
            disabled={isPending}
        />
    );
}