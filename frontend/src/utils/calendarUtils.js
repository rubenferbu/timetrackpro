export const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function getMonthLabel(date) {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

export function getMonthMatrix(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstWeekday = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < firstWeekday; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

    return days;
}

export function getMonthRange(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0, 23, 59, 59);
    return { from, to };
}

function isSameDay(a, b) {
    return a.toDateString() === b.toDateString();
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function getDayStatus(date, entries, leaveRequests) {
    const overlapping = leaveRequests.filter((lr) => {
        const start = new Date(new Date(lr.startDate).toDateString());
        const end = new Date(new Date(lr.endDate).toDateString());
        return date >= start && date <= end;
    });

    const approved = overlapping.find((lr) => lr.status === 'approved');
    if (approved) return approved.type;

    const pending = overlapping.find((lr) => lr.status === 'pending');
    if (pending) return 'pending';

    const worked = entries.some((e) => isSameDay(new Date(e.clockIn), date));
    if (worked) return 'worked';

    if (isWeekend(date)) return 'weekend';
    if (date > new Date()) return 'future';

    return 'empty';
}