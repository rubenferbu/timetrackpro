import { useTimeEntries } from '../../hooks/useTimeEntries';
import { formatDateTime, formatDuration } from '../../utils/formatTime';
import './MyTimeEntries.css';

function MyTimeEntries() {
    const { entries, openEntry, isLoading, isSubmitting, error, handleClockIn, handleClockOut } =
        useTimeEntries();

    return (
        <div className="time-entries-page">
            <h1>Mis fichajes</h1>

            {error && <div className="te-error" role="alert">{error}</div>}

            <div className="te-clock-card">
                {openEntry ? (
                    <div>
                        <p className="te-clock-label">Estás fichado desde</p>
                        <p className="te-clock-time">{formatDateTime(openEntry.clockIn)}</p>
                    </div>
                ) : (
                    <p className="te-clock-label">No tienes ningún fichaje abierto</p>
                )}

                <button
                    className={openEntry ? 'te-btn-out' : 'te-btn-in'}
                    onClick={openEntry ? handleClockOut : handleClockIn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : openEntry ? 'Fichar salida' : 'Fichar entrada'}
                </button>
            </div>

            <h2 className="te-section-title">Fichajes recientes</h2>

            {isLoading ? (
                <div className="te-skeleton" />
            ) : entries.length === 0 ? (
                <p className="te-empty">Aún no tienes fichajes — pulsa "Fichar entrada" para empezar.</p>
            ) : (
                <div className="te-table">
                    {entries.map((entry) => (
                        <div className="te-row" key={entry._id}>
                            <span data-label="Entrada">{formatDateTime(entry.clockIn)}</span>
                            <span data-label="Salida">{entry.clockOut ? formatDateTime(entry.clockOut) : 'En curso'}</span>
                            <span data-label="Duración">{formatDuration(entry.durationMinutes)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTimeEntries;