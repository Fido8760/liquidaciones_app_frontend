export function formatDate(isoString: string) {
    const date = new Date(isoString)
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    })

    return formatter.format(date)
}

export function formatDateTime(input: Date | string) {
    if (!input) return '';

    const str = typeof input === 'string'
        ? input.replace(' ', 'T')
        : input;

    const date = new Date(str);

    if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', input);
        return '';
    }

    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
}

export function formatDateOnly(dateString: string, weekday = false) {
    const [year, month, day] = dateString.split('-');

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return new Intl.DateTimeFormat('es-MX', {
        ...(weekday && { weekday: 'long' }),
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).format(date);
}