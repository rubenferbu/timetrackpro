import { DAY_LABELS, getMonthLabel } from '../../utils/calendarUtils';
import { useWorkCalendar } from '../../hooks/useWorkCalendar';
import './WorkCalendar.css';

const STATUS_LABELS = {
    worked: 'Trabajado',
    vacation: 'Vacaciones',
    sick: 'Baja médica',
    personal: 'Asunto personal',
    pending: 'Solicitud pendiente',
    weekend: 'Fin de semana',
    future: 'Próximo',
    empty: 'Sin registro',
};

function WorkCalendar() {
    const { referenceDate, days, statusByDay, summary, isLoading, error, goToPreviousMonth, goToNextMonth } =
        useWorkCalendar();

    return (
        <div className="wc-card">
            <div className="wc-header">
                <button className="wc-nav" onClick={goToPreviousMonth} aria-label="Mes anterior">‹</button>
                <h2 className="wc-title">{getMonthLabel(referenceDate)}</h2>
                <button className="wc-nav" onClick={goToNextMonth} aria-label="Mes siguiente">›</button>
            </div>

            {error && <div className="wc-error" role="alert">{error}</div>}

            {isLoading ? (
                <div className="wc-skeleton" />
            ) : (
                <>
                    <div className="wc-grid wc-grid-header">
                        {DAY_LABELS.map((label) => (
                            <span key={label} className="wc-day-label">{label}</span>
                        ))}
                    </div>

                    <div className="wc-grid">
                        {days.map((day, i) =>
                            day ? (
                                <div
                                    key={day.toISOString()}
                                    className={`wc-day wc-status-${statusByDay.get(day.toDateString())}`}
                                    title={STATUS_LABELS[statusByDay.get(day.toDateString())]}
                                >
                                    {day.getDate()}
                                </div>
                            ) : (
                                <div key={`blank-${i}`} className="wc-day wc-day-blank" />
                            )
                        )}
                    </div>

                    <div className="wc-summary">
                        <span><span className="wc-dot wc-status-worked" /> Trabajados: {summary.worked}</span>
                        <span><span className="wc-dot wc-status-vacation" /> Vacaciones: {summary.vacation}</span>
                        <span><span className="wc-dot wc-status-sick" /> Baja: {summary.sick}</span>
                        <span><span className="wc-dot wc-status-personal" /> Asuntos: {summary.personal}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default WorkCalendar;