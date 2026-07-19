import { useState, useEffect, useCallback } from 'react';
import timeEntryService from '../services/timeEntryService';
import leaveRequestService from '../services/leaveRequestService';
import teamService from '../services/teamService';
import employeeService from '../services/employeeService';

function startOfWeek() {
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay(); // lunes = 1 ... domingo = 7
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
}

function isSameDay(a, b) {
    return new Date(a).toDateString() === new Date(b).toDateString();
}

export function useDashboardSummary(role) {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const today = new Date();

            const [entriesRes, myPendingRes] = await Promise.all([
                timeEntryService.listMine({ from: startOfWeek().toISOString(), limit: 50 }),
                leaveRequestService.listMine({ status: 'pending', limit: 1 }),
            ]);

            const entries = entriesRes.data;
            const openEntry = entries.find((e) => !e.clockOut) || null;

            const hoursTodayMinutes = entries
                .filter((e) => e.durationMinutes != null && isSameDay(e.clockIn, today))
                .reduce((sum, e) => sum + e.durationMinutes, 0);

            const hoursWeekMinutes = entries
                .filter((e) => e.durationMinutes != null)
                .reduce((sum, e) => sum + e.durationMinutes, 0);

            const result = {
                openEntry,
                hoursTodayMinutes,
                hoursWeekMinutes,
                myPendingCount: myPendingRes.meta.total,
            };

            if (role === 'manager' || role === 'companyAdmin') {
                const teamPendingRes = await teamService.listLeaveRequests({ status: 'pending', limit: 1 });
                result.teamPendingCount = teamPendingRes.meta.total;
            }

            if (role === 'companyAdmin') {
                const employeesRes = await employeeService.list({ limit: 1 });
                result.employeeCount = employeesRes.meta.total;
            }

            setSummary(result);
        } catch (err) {
            setError('No se pudo cargar el resumen');
        } finally {
            setIsLoading(false);
        }
    }, [role]);

    useEffect(() => {
        load();
    }, [load]);

    return { summary, isLoading, error, reload: load };
}
