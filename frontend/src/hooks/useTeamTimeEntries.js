import { useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';

export function useTeamTimeEntries() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await teamService.listTimeEntries({ limit: 20 });
            setEntries(data);
        } catch (err) {
            setError('No se pudieron cargar los fichajes del equipo');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { entries, isLoading, error, reload: load };
}