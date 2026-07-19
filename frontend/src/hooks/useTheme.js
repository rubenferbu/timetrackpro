import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

function resolveTheme(theme) {
    if (theme !== 'system') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        const apply = () => {
            document.documentElement.setAttribute('data-theme', resolveTheme(theme));
        };
        apply();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', apply);
            return () => mediaQuery.removeEventListener('change', apply);
        }
    }, [theme]);

    return { theme, setTheme, resolvedTheme: resolveTheme(theme) };
}