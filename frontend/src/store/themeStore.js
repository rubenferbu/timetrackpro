import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 'system' significa "sigue la preferencia del sistema operativo".
// 'light' / 'dark' son overrides manuales explícitos del usuario.
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'timetrackpro-theme' }
  )
);