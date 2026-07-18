import { useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';

export function useTeamLeaveRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await teamService.listLeaveRequests();
            setRequests(data);
        } catch (err) {
            setError('No se pudieron cargar las solicitudes del equipo');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function resolve(id, action) {
        setProcessingId(id);
        setError(null);
        try {
            if (action === 'approve') await teamService.approveLeaveRequest(id);
            else await teamService.rejectLeaveRequest(id);
            await load();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo procesar la solicitud');
        } finally {
            setProcessingId(null);
        }
    }

    return { requests, isLoading, error, processingId, resolve };
}