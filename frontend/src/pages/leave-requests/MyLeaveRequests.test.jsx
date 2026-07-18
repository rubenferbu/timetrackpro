import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyLeaveRequests from './MyLeaveRequests';
import leaveRequestService from '../../services/leaveRequestService';

vi.mock('../../services/leaveRequestService');

describe('MyLeaveRequests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el mensaje de estado vacío cuando no hay solicitudes', async () => {
        leaveRequestService.listMine.mockResolvedValue({ data: [] });

        render(<MyLeaveRequests />);

        expect(await screen.findByText(/aún no has solicitado/i)).toBeInTheDocument();
    });

    it('lista las solicitudes existentes con su estado', async () => {
        leaveRequestService.listMine.mockResolvedValue({
            data: [
                { _id: '1', type: 'vacation', startDate: '2026-08-01', endDate: '2026-08-05', status: 'pending' },
            ],
        });

        render(<MyLeaveRequests />);

        expect(await screen.findByText('Vacaciones')).toBeInTheDocument();
        expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('crea una nueva solicitud y refresca la lista', async () => {
        const user = userEvent.setup();
        leaveRequestService.listMine.mockResolvedValue({ data: [] });
        leaveRequestService.create.mockResolvedValue({ _id: '2', status: 'pending' });

        render(<MyLeaveRequests />);

        await user.click(screen.getByRole('button', { name: /nueva solicitud/i }));
        await user.type(screen.getByLabelText(/fecha de inicio/i), '2026-08-01');
        await user.type(screen.getByLabelText(/fecha de fin/i), '2026-08-05');
        await user.click(screen.getByRole('button', { name: /enviar solicitud/i }));

        expect(leaveRequestService.create).toHaveBeenCalledWith({
            type: 'vacation',
            startDate: '2026-08-01',
            endDate: '2026-08-05',
        });
        expect(leaveRequestService.listMine).toHaveBeenCalledTimes(2); // carga inicial + refresco tras crear
    });
});