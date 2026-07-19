import { useAuth } from '../../hooks/useAuth';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { formatDuration } from '../../utils/formatTime';
import WorkCalendar from '../../components/calendar/WorkCalendar';
import SuperAdminDashboard from './SuperAdminDashboard';
import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();

    if (user?.role === 'superAdmin') {
        return <SuperAdminDashboard />;
    }

    return <CompanyDashboard role={user?.role} name={user?.name} />;
}

function CompanyDashboard({ role, name }) {
    const { summary, isLoading, error } = useDashboardSummary(role);

    return (
        <div className="dashboard-page">
            <h1>Hola, {name}</h1>
            <p className="dashboard-subtitle">Bienvenido de nuevo a TimeTrack Pro</p>

            {error && <div className="dashboard-error" role="alert">{error}</div>}

            {isLoading ? (
                <div className="dashboard-skeleton" />
            ) : (
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <p className="dashboard-card-label">
                            {summary.openEntry ? 'Fichado desde' : 'Sin fichaje abierto'}
                        </p>
                        <p className="dashboard-card-value">
                            {summary.openEntry
                                ? new Date(summary.openEntry.clockIn).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : '—'}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <p className="dashboard-card-label">Horas hoy</p>
                        <p className="dashboard-card-value">{formatDuration(summary.hoursTodayMinutes)}</p>
                    </div>

                    <div className="dashboard-card">
                        <p className="dashboard-card-label">Horas esta semana</p>
                        <p className="dashboard-card-value">{formatDuration(summary.hoursWeekMinutes)}</p>
                    </div>

                    <div className="dashboard-card">
                        <p className="dashboard-card-label">Mis solicitudes pendientes</p>
                        <p className="dashboard-card-value">{summary.myPendingCount}</p>
                    </div>

                    {(role === 'manager' || role === 'companyAdmin') && (
                        <div className="dashboard-card dashboard-card-highlight">
                            <p className="dashboard-card-label">Solicitudes de equipo por aprobar</p>
                            <p className="dashboard-card-value">{summary.teamPendingCount}</p>
                        </div>
                    )}

                    {role === 'companyAdmin' && (
                        <div className="dashboard-card">
                            <p className="dashboard-card-label">Empleados en la empresa</p>
                            <p className="dashboard-card-value">{summary.employeeCount}</p>
                        </div>
                    )}
                </div>
            )}

            <WorkCalendar />
        </div>
    );
}

export default Dashboard;