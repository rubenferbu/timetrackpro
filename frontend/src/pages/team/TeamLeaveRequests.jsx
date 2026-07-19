import { useTeamLeaveRequests } from '../../hooks/useTeamLeaveRequests';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from '../../constants/leaveTypes';
import { formatDateTime } from '../../utils/formatTime';
import './Team.css';

function TeamLeaveRequests() {
    const { requests, isLoading, error, processingId, resolve } = useTeamLeaveRequests();

    return (
        <div className="team-page">
            <h1>Aprobar solicitudes</h1>

            {error && <div className="team-error" role="alert">{error}</div>}

            {isLoading ? (
                <div className="team-skeleton" />
            ) : requests.length === 0 ? (
                <p className="team-empty">No hay solicitudes de tu equipo.</p>
            ) : (
                <div className="team-table">
                    {requests.map((req) => (
                        <div className="team-row team-row-actions" key={req._id}>
                            <span className="team-row-name" data-label="Empleado">{req.userId?.name}</span>
                            <span data-label="Tipo">{LEAVE_TYPE_LABELS[req.type]}</span>
                            <span data-label="Fechas">{formatDateTime(req.startDate)} → {formatDateTime(req.endDate)}</span>

                            {req.status === 'pending' ? (
                                <span className="team-actions" data-label="Acciones">
                                    <button
                                        className="team-btn-approve"
                                        disabled={processingId === req._id}
                                        onClick={() => resolve(req._id, 'approve')}
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        className="team-btn-reject"
                                        disabled={processingId === req._id}
                                        onClick={() => resolve(req._id, 'reject')}
                                    >
                                        Rechazar
                                    </button>
                                </span>
                            ) : (
                                <span className={`lr-badge lr-badge-${req.status}`} data-label="Estado">
                                    {LEAVE_STATUS_LABELS[req.status]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeamLeaveRequests;