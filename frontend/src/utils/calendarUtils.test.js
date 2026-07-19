import { describe, it, expect } from 'vitest';
import { getDayStatus, getMonthMatrix } from './calendarUtils';

describe('calendarUtils', () => {
    it('detecta un fin de semana', () => {
        const saturday = new Date(2026, 6, 18); // 18 julio 2026 = sábado
        expect(getDayStatus(saturday, [], [])).toBe('weekend');
    });

    it('detecta un día trabajado a partir de un fichaje', () => {
        const day = new Date(2026, 6, 15);
        const entries = [{ clockIn: '2026-07-15T09:00:00.000Z' }];
        expect(getDayStatus(day, entries, [])).toBe('worked');
    });

    it('una solicitud aprobada tiene prioridad sobre el fichaje', () => {
        const day = new Date(2026, 6, 15);
        const leaveRequests = [
            { type: 'vacation', status: 'approved', startDate: '2026-07-14', endDate: '2026-07-16' },
        ];
        expect(getDayStatus(day, [], leaveRequests)).toBe('vacation');
    });

    it('marca una solicitud pendiente cuando no hay ninguna aprobada', () => {
        const day = new Date(2026, 6, 20);
        const leaveRequests = [
            { type: 'personal', status: 'pending', startDate: '2026-07-20', endDate: '2026-07-20' },
        ];
        expect(getDayStatus(day, [], leaveRequests)).toBe('pending');
    });

    it('genera la matriz del mes con todos sus días', () => {
        const days = getMonthMatrix(new Date(2026, 6, 1));
        expect(days.filter(Boolean)).toHaveLength(31);
    });
});