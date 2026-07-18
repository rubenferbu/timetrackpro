import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import "./Login.css";

function login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { user, token } = await authService.login(email, password);
            setAuth(user, token);
            navigate("/dashboard");
        } catch (err) {
            const message =
                err.response?.data?.error?.message || "No se pudo iniciar sesión";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>TimeTrack Pro</h1>
                <p className="login-subtitle">Inicia sesión en tu cuenta</p>

                {error && (
                    <div className="login-error" role="alert">
                        {error}
                    </div>
                )}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Iniciar sesión"}
                </button>

                <p className="login-footer">
                    ¿No tienes cuenta? <Link to="/register">Registra tu empresa</Link>
                </p>
            </form>
        </div>
    );
}

export default login;
