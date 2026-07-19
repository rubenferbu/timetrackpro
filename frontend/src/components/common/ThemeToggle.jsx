import { Sun, Monitor, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

const OPTIONS = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
    { value: 'dark', icon: Moon, label: 'Oscuro' },
];

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="theme-toggle" role="radiogroup" aria-label="Tema de la aplicación">
            {OPTIONS.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    role="radio"
                    aria-checked={theme === value}
                    aria-label={label}
                    title={label}
                    className={`theme-toggle-btn${theme === value ? ' active' : ''}`}
                    onClick={() => setTheme(value)}
                >
                    <Icon size={14} />
                </button>
            ))}
        </div>
    );
}

export default ThemeToggle;