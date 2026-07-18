import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,

            setAuth: (user, token) => set({ user, token }),

            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'timetrackpro-auth', // clave bajo la que se guarda en localStorage
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);