import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';
import './Sidebar.css';

function Sidebar({ onNavigate }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <Logo size={24} showWordmark={!user?.companyId?.name} />
                {user?.companyId?.name && <span className="sidebar-brand-company">{user.companyId.name}</span>}
            </div>

            <nav className="sidebar-nav">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <ThemeToggle />
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                    <span>{user?.name}</span>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;