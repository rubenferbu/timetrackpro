import { useTeamTimeEntries } from '../../hooks/useTeamTimeEntries';
import { formatDateTime, formatDuration } from '../../utils/formatTime';
import './Team.css';

function TeamTimeEntries() {
    const { entries, isLoading, error } = useTeamTimeEntries();

    return (
        <div className="team-page">
            <h1>Fichajes del equipo</h1>

            {error && <div className="team-error" role="alert">{error}</div>}

            {isLoading ? (
                <div className="team-skeleton" />
            ) : entries.length === 0 ? (
                <p className="team-empty">Tu equipo aún no tiene fichajes registrados.</p>
            ) : (
                <div className="team-table">
                    {entries.map((entry) => (
                        <div className="team-row" key={entry._id}>
                            <span className="team-row-name">{entry.userId?.name}</span>
                            <span>{formatDateTime(entry.clockIn)}</span>
                            <span>{entry.clockOut ? formatDateTime(entry.clockOut) : 'En curso'}</span>
                            <span>{formatDuration(entry.durationMinutes)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeamTimeEntries;