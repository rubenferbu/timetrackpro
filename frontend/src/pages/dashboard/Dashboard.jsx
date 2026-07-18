import { useAuth } from "../../hooks/useAuth";
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard-page">
            <h1>Hola, {user?.name}</h1>
            <p className="dashboard-subtitle">Bienvenido de nuevo a TimeTrack Pro</p>
        </div>
    );
}

export default Dashboard;