import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuperAdminDashboard from './SuperAdminDashboard';
import companyService from '../../services/companyService';

vi.mock('../../services/companyService');

const sampleCompany = { _id: '1', name: 'Acme Iberica SL', plan: 'premium', status: 'active' };

describe('SuperAdminDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el listado de empresas con su estado', async () => {
        companyService.list.mockResolvedValue({ data: [sampleCompany] });

        render(<SuperAdminDashboard />);

        expect(await screen.findByText('Acme Iberica SL')).toBeInTheDocument();
        expect(screen.getByText('Activa')).toBeInTheDocument();
    });

    it('suspende una empresa activa', async () => {
        const user = userEvent.setup();
        companyService.list.mockResolvedValue({ data: [sampleCompany] });
        companyService.updateStatus.mockResolvedValue({ ...sampleCompany, status: 'suspended' });

        render(<SuperAdminDashboard />);

        const suspendBtn = await screen.findByRole('button', { name: /suspender/i });
        await user.click(suspendBtn);

        expect(companyService.updateStatus).toHaveBeenCalledWith('1', 'suspended');
    });
});