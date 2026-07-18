import { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { ROLE_LABELS, CREATABLE_ROLES } from '../../constants/roles';
import './Employees.css';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'employee', managerId: '' };

function Employees() {
    const {
        employees,
        isLoading,
        isSubmitting,
        error,
        createEmployee,
        updateEmployee,
        deactivateEmployee,
        reactivateEmployee,
    } = useEmployees();

    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const managers = employees.filter((e) => ['manager', 'companyAdmin'].includes(e.role));

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function openCreateForm() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFormVisible(true);
    }

    function openEditForm(employee) {
        setEditingId(employee._id);
        setForm({
            name: employee.name,
            email: employee.email,
            password: '',
            role: employee.role,
            managerId: employee.managerId || '',
        });
        setFormVisible(true);
    }

    function closeForm() {
        setFormVisible(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let ok;
        if (editingId) {
            const { name, role, managerId } = form;
            ok = await updateEmployee(editingId, { name, role, managerId: managerId || null });
        } else {
            ok = await createEmployee(form);
        }
        if (ok) closeForm();
    }

    return (
        <div className="emp-page">
            <div className="emp-header">
                <h1>Empleados</h1>
                <button className="emp-btn-new" onClick={openCreateForm}>+ Nuevo empleado</button>
            </div>

            {error && <div className="emp-error" role="alert">{error}</div>}

            {formVisible && (
                <form className="emp-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} required />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={Boolean(editingId)}
                        required
                    />

                    {!editingId && (
                        <>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <label htmlFor="role">Rol</label>
                    <select id="role" name="role" value={form.role} onChange={handleChange}>
                        {CREATABLE_ROLES.map((role) => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                        ))}
                    </select>

                    <label htmlFor="managerId">Manager (opcional)</label>
                    <select id="managerId" name="managerId" value={form.managerId} onChange={handleChange}>
                        <option value="">Sin asignar</option>
                        {managers
                            .filter((m) => m._id !== editingId)
                            .map((m) => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                            ))}
                    </select>

                    <div className="emp-form-actions">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear empleado'}
                        </button>
                        <button type="button" className="emp-btn-cancel" onClick={closeForm}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="emp-skeleton" />
            ) : employees.length === 0 ? (
                <p className="emp-empty">Aún no hay empleados en tu empresa.</p>
            ) : (
                <div className="emp-table">
                    {employees.map((emp) => (
                        <div className="emp-row" key={emp._id}>
                            <span className="emp-row-name">{emp.name}</span>
                            <span>{emp.email}</span>
                            <span>{ROLE_LABELS[emp.role]}</span>
                            <span className={emp.isActive ? 'emp-status-active' : 'emp-status-inactive'}>
                                {emp.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="emp-actions">
                                <button onClick={() => openEditForm(emp)}>Editar</button>
                                {emp.isActive ? (
                                    <button className="emp-btn-danger" onClick={() => deactivateEmployee(emp._id)}>
                                        Desactivar
                                    </button>
                                ) : (
                                    <button onClick={() => reactivateEmployee(emp._id)}>Reactivar</button>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Employees;