import { useState } from 'react';
import { useLeaveRequests } from '../../hooks/useLeaveRequests';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from '../../constants/leaveTypes';
import { formatDateTime } from '../../utils/formatTime';
import './MyLeaveRequests.css';

function MyLeaveRequests() {
    const { requests, isLoading, isSubmitting, error, createRequest } = useLeaveRequests();

    const [form, setForm] = useState({ type: 'vacation', startDate: '', endDate: '' });
    const [formVisible, setFormVisible] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const ok = await createRequest(form);
        if (ok) {
            setForm({ type: 'vacation', startDate: '', endDate: '' });
            setFormVisible(false);
        }
    }

    return (
        <div className="lr-page">
            <div className="lr-header">
                <h1>Mis solicitudes</h1>
                <button className="lr-btn-new" onClick={() => setFormVisible((v) => !v)}>
                    {formVisible ? 'Cancelar' : '+ Nueva solicitud'}
                </button>
            </div>

            {error && <div className="lr-error" role="alert">{error}</div>}

            {formVisible && (
                <form className="lr-form" onSubmit={handleSubmit}>
                    <label htmlFor="type">Tipo</label>
                    <select id="type" name="type" value={form.type} onChange={handleChange}>
                        {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <label htmlFor="startDate">Fecha de inicio</label>
                    <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />

                    <label htmlFor="endDate">Fecha de fin</label>
                    <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="lr-skeleton" />
            ) : requests.length === 0 ? (
                <p className="lr-empty">Aún no has solicitado ninguna ausencia.</p>
            ) : (
                <div className="lr-table">
                    {requests.map((req) => (
                        <div className="lr-row" key={req._id}>
                            <span data-label="Tipo">{LEAVE_TYPE_LABELS[req.type]}</span>
                            <span data-label="Fechas">{formatDateTime(req.startDate)} → {formatDateTime(req.endDate)}</span>
                            <span className={`lr-badge lr-badge-${req.status}`} data-label="Estado">
                                {LEAVE_STATUS_LABELS[req.status]}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLeaveRequests;