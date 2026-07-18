import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Employees from './Employees';
import employeeService from '../../services/employeeService';

vi.mock('../../services/employeeService');

const sampleEmployee = {
    _id: '1',
    name: 'Empleado Uno',
    email: 'empleado1@acme.com',
    role: 'employee',
    isActive: true,
    managerId: null,
};

describe('Employees', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el estado vacío cuando no hay empleados', async () => {
        employeeService.list.mockResolvedValue({ data: [] });

        render(<Employees />);

        expect(await screen.findByText(/aún no hay empleados/i)).toBeInTheDocument();
    });

    it('lista los empleados existentes', async () => {
        employeeService.list.mockResolvedValue({ data: [sampleEmployee] });

        render(<Employees />);

        expect(await screen.findByText('Empleado Uno')).toBeInTheDocument();
        expect(screen.getByText('empleado1@acme.com')).toBeInTheDocument();
        expect(screen.getByText('Activo')).toBeInTheDocument();
    });

    it('crea un nuevo empleado', async () => {
        const user = userEvent.setup();
        employeeService.list.mockResolvedValue({ data: [] });
        employeeService.create.mockResolvedValue({ _id: '2' });

        render(<Employees />);

        await user.click(await screen.findByRole('button', { name: /nuevo empleado/i }));
        await user.type(screen.getByLabelText(/nombre/i), 'Empleado Nuevo');
        await user.type(screen.getByLabelText(/email/i), 'nuevo@acme.com');
        await user.type(screen.getByLabelText(/contraseña/i), 'Password123!');
        await user.click(screen.getByRole('button', { name: /crear empleado/i }));

        expect(employeeService.create).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Empleado Nuevo', email: 'nuevo@acme.com' })
        );
    });

    it('desactiva un empleado activo', async () => {
        const user = userEvent.setup();
        employeeService.list.mockResolvedValue({ data: [sampleEmployee] });
        employeeService.deactivate.mockResolvedValue({ ...sampleEmployee, isActive: false });

        render(<Employees />);

        const deactivateBtn = await screen.findByRole('button', { name: /desactivar/i });
        await user.click(deactivateBtn);

        expect(employeeService.deactivate).toHaveBeenCalledWith('1');
    });
});