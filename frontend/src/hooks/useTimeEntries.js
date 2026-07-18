import { useState, useEffect, useCallback } from "react";
import timeEntryService from '../services/timeEntryService';

export function useTimeEntries() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadEntries = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await timeEntryService.listMine({ limit: 10 });
            setEntries(data);
        } catch (err) {
            setError('No se pudieron cargar tus fichajes')
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    const openEntry = entries.find((e) => !e.clockOut) || null;

    async function handleClockIn() {
        setIsSubmitting(true);
        setError(null);
        try {
            await timeEntryService.clockIn();
            await loadEntries();
        } catch (err) {
            setError(err.response?.data?.error?.massage || 'No se pudo registrar la entrada');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleClockOut() {
        setIsSubmitting(true);
        setError(null);
        try {
            await timeEntryService.clockOut();
            await loadEntries();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo registrar la salida');
        } finally {
            setIsSubmitting(false);
        }
    }

    return { entries, openEntry, isLoading, isSubmitting, error, handleClockIn, handleClockOut };
}