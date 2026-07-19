import { useState, useEffect, useCallback, useMemo } from 'react';
import timeEntryService from '../services/timeEntryService';
import leaveRequestService from '../services/leaveRequestService';
import { getMonthRange, getMonthMatrix, getDayStatus } from '../utils/calendarUtils';

export function useWorkCalendar() {
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { from, to } = getMonthRange(referenceDate);
            const [entriesRes, leaveRes] = await Promise.all([
                timeEntryService.listMine({ from: from.toISOString(), to: to.toISOString(), limit: 100 }),
                leaveRequestService.listMine({ limit: 100 }),
            ]);
            setEntries(entriesRes.data);
            setLeaveRequests(leaveRes.data);
        } catch (err) {
            setError('No se pudo cargar el calendario laboral');
        } finally {
            setIsLoading(false);
        }
    }, [referenceDate]);

    useEffect(() => {
        load();
    }, [load]);

    const days = useMemo(() => getMonthMatrix(referenceDate), [referenceDate]);

    const statusByDay = useMemo(() => {
        const map = new Map();
        days.forEach((day) => {
            if (!day) return;
            map.set(day.toDateString(), getDayStatus(day, entries, leaveRequests));
        });
        return map;
    }, [days, entries, leaveRequests]);

    const summary = useMemo(() => {
        const counts = { worked: 0, vacation: 0, sick: 0, personal: 0 };
        statusByDay.forEach((status) => {
            if (counts[status] !== undefined) counts[status] += 1;
        });
        return counts;
    }, [statusByDay]);

    function goToPreviousMonth() {
        setReferenceDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }

    function goToNextMonth() {
        setReferenceDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }

    return { referenceDate, days, statusByDay, summary, isLoading, error, goToPreviousMonth, goToNextMonth };
}