import { useState, useEffect, useCallback } from "react";
import leaveRequestService from "../services/leaveRequestService";

export function useLeaveRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await leaveRequestService.listMine();
            setRequests(data);
        } catch (err) {
            setError('No se pidieron cargar tus solicitudes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    async function createRequest(formData) {
        setIsSubmitting(true);
        setError(null);
        try {
            await leaveRequestService.create(formData);
            await loadRequests();
            return true;
        } catch (err) {
            setError(err.response?.data?.error?.massage || 'No se pudo crear la solicitud');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }
    return { requests, isLoading, isSubmitting, error, createRequest };
}