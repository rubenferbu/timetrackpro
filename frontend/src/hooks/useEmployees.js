import { useState, useEffect, useCallback } from 'react';
import employeeService from '../services/employeeService';

export function useEmployees() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await employeeService.list({ limit: 100 });
            setEmployees(data);
        } catch (err) {
            setError('No se pudieron cargar los empleados');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function createEmployee(formData) {
        setIsSubmitting(true);
        setError(null);
        try {
            await employeeService.create(formData);
            await load();
            return true;
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo crear el empleado');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    async function updateEmployee(id, formData) {
        setIsSubmitting(true);
        setError(null);
        try {
            await employeeService.update(id, formData);
            await load();
            return true;
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo actualizar el empleado');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    async function deactivateEmployee(id) {
        setIsSubmitting(true);
        setError(null);
        try {
            await employeeService.deactivate(id);
            await load();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo desactivar el empleado');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function reactivateEmployee(id) {
        setIsSubmitting(true);
        setError(null);
        try {
            await employeeService.update(id, { isActive: true });
            await load();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'No se pudo reactivar el empleado');
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        employees,
        isLoading,
        isSubmitting,
        error,
        createEmployee,
        updateEmployee,
        deactivateEmployee,
        reactivateEmployee,
    };
}