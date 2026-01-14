export function formatDate(isoString: string) {
    const date = new Date(isoString)
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    })

    return formatter.format(date)
}

export function formatDateTime(dateString: string | null | undefined) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    const formatter = new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return formatter.format(date);
}