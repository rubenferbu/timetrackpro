import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

// No queremos llamar a la API real en un test -> mockeamos el servicio.
vi.mock('../../services/authService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
}

describe('Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({ user: null, token: null });
    });

    it('hace login correctamente y navega al dashboard', async () => {
        const user = userEvent.setup();
        authService.login.mockResolvedValue({
            user: { id: '1', name: 'Rubén', role: 'companyAdmin' },
            token: 'fake-token',
        });

        renderLogin();

        await user.type(screen.getByLabelText(/email/i), 'ruben@miempresa.com');
        await user.type(screen.getByLabelText(/contraseña/i), 'Password123!');
        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(authService.login).toHaveBeenCalledWith('ruben@miempresa.com', 'Password123!');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        expect(useAuthStore.getState().token).toBe('fake-token');
    });

    it('muestra un mensaje de error si las credenciales son incorrectas', async () => {
        const user = userEvent.setup();
        authService.login.mockRejectedValue({
            response: { data: { error: { message: 'Email o contraseña incorrectos' } } },
        });

        renderLogin();

        await user.type(screen.getByLabelText(/email/i), 'ruben@miempresa.com');
        await user.type(screen.getByLabelText(/contraseña/i), 'mal');
        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos');
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});