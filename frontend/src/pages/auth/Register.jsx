import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import './Login.css';


function Register() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [form, setForm] = useState({
        companyName: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleChange(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { user, token } = await authService.registerCompany(form);
            setAuth(user, token);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.error?.massage || 'No se pudo completar el registro';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Registra tu empresa</h1>
                <p className="login-subtitle">Crea tu cuenta de administrador</p>

                {error && <div className="login-error" role="alert">{error}</div>}

                <label htmlFor="companyName">Nombre de la empresa</label>
                <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} required />

                <label htmlFor="adminName">Tu nombre</label>
                <input id="adminName" name="adminName" value={form.adminName} onChange={handleChange} required />

                <label htmlFor="adminEmail">Email</label>
                <input id="adminEmail" name="adminEmail" type="email" value={form.adminEmail} onChange={handleChange} required />

                <label htmlFor="adminPassword">Contraseña</label>
                <input id="adminPassword" name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} required />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>

                <p className="login-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;