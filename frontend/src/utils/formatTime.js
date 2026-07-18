export function formatDateTime(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDuration(minutes) {
    if (minutes == null) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
}