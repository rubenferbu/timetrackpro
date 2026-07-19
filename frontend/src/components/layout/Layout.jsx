import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="app-layout">
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menú"
            >
                <Menu size={22} />
            </button>

            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <div className={`sidebar-wrapper${isMobileMenuOpen ? ' open' : ''}`}>
                <button
                    className="mobile-menu-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                >
                    <X size={20} />
                </button>
                <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;