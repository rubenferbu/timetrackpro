import { useCompanies } from '../../hooks/useCompanies';
import './SuperAdminDashboard.css';

function SuperAdminDashboard() {
    const { companies, isLoading, error, processingId, toggleStatus } = useCompanies();

    const activeCount = companies.filter((c) => c.status === 'active').length;
    const suspendedCount = companies.filter((c) => c.status === 'suspended').length;

    return (
        <div className="sa-page">
            <h1>Panel de plataforma</h1>
            <p className="sa-subtitle">Gestión de empresas cliente</p>

            {error && <div className="sa-error" role="alert">{error}</div>}

            <div className="sa-summary">
                <div className="sa-summary-card">
                    <p className="sa-summary-label">Empresas totales</p>
                    <p className="sa-summary-value">{companies.length}</p>
                </div>
                <div className="sa-summary-card">
                    <p className="sa-summary-label">Activas</p>
                    <p className="sa-summary-value sa-value-active">{activeCount}</p>
                </div>
                <div className="sa-summary-card">
                    <p className="sa-summary-label">Suspendidas</p>
                    <p className="sa-summary-value sa-value-suspended">{suspendedCount}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="sa-skeleton" />
            ) : (
                <div className="sa-table">
                    {companies.map((company) => (
                        <div className="sa-row" key={company._id}>
                            <span className="sa-row-name" data-label="Empresa">{company.name}</span>
                            <span className="sa-plan-badge" data-label="Plan">{company.plan}</span>
                            <span
                                data-label="Estado"
                                className={company.status === 'active' ? 'sa-status-active' : 'sa-status-suspended'}
                            >
                                {company.status === 'active' ? 'Activa' : 'Suspendida'}
                            </span>
                            <button
                                className={company.status === 'active' ? 'sa-btn-suspend' : 'sa-btn-activate'}
                                disabled={processingId === company._id}
                                onClick={() => toggleStatus(company)}
                            >
                                {company.status === 'active' ? 'Suspender' : 'Activar'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SuperAdminDashboard;