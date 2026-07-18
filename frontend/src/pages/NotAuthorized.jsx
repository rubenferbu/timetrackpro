import { Link } from 'react-router-dom';

function NotAuthorized() {
    return (
        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
            <h1>Acceso no autorizado</h1>
            <p>No tienes permiso para ver esta página.</p>
            <Link to="/dashboard">Volver al dashboard</Link>
        </div>
    );
}

export default NotAuthorized;