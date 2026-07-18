import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamLeaveRequests from './TeamLeaveRequests';
import teamService from '../../services/teamService';

vi.mock('../../services/teamService');

describe('TeamLeaveRequests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el estado vacío cuando el equipo no tiene solicitudes', async () => {
        teamService.listLeaveRequests.mockResolvedValue({ data: [] });

        render(<TeamLeaveRequests />);

        expect(await screen.findByText(/no hay solicitudes/i)).toBeInTheDocument();
    });

    it('muestra botones de aprobar/rechazar solo para solicitudes pendientes', async () => {
        teamService.listLeaveRequests.mockResolvedValue({
            data: [
                {
                    _id: '1',
                    type: 'vacation',
                    startDate: '2026-08-01',
                    endDate: '2026-08-05',
                    status: 'pending',
                    userId: { name: 'Empleado Uno' },
                },
            ],
        });

        render(<TeamLeaveRequests />);

        expect(await screen.findByText('Empleado Uno')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /aprobar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument();
    });

    it('aprueba una solicitud y refresca la lista', async () => {
        const user = userEvent.setup();
        teamService.listLeaveRequests.mockResolvedValue({
            data: [
                {
                    _id: '1',
                    type: 'vacation',
                    startDate: '2026-08-01',
                    endDate: '2026-08-05',
                    status: 'pending',
                    userId: { name: 'Empleado Uno' },
                },
            ],
        });
        teamService.approveLeaveRequest.mockResolvedValue({ _id: '1', status: 'approved' });

        render(<TeamLeaveRequests />);

        const approveBtn = await screen.findByRole('button', { name: /aprobar/i });
        await user.click(approveBtn);

        expect(teamService.approveLeaveRequest).toHaveBeenCalledWith('1');
        expect(teamService.listLeaveRequests).toHaveBeenCalledTimes(2);
    });
});