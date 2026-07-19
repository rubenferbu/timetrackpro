import { useState, useEffect, useCallback } from "react";
import companyService from "../services/companyService";

export function useCompanies() {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await companyService.list({ limit: 100 });
            setCompanies(data);
        } catch (err) {
            setError('No se pudieron cargar las empresas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function toggleStatus(company) {
        const newStatus = company.status === 'active' ? 'suspended' : 'active';
        setProcessingId(company._id);
        setError(null);
        try {
            await companyService.updateStatus(company._id, newStatus);
            await load();
        } catch (err) {
            setError('No se pudo actualizar el estado de la empresa');
        } finally {
            setProcessingId(null);
        }
    }
    return { companies, isLoading, error, processingId, toggleStatus }
}