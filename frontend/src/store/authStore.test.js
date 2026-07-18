import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";


describe('authStore', () =>{
    beforeEach(() => {
        //Reseteamos el store antes de cada Test para que no se contaminen entre sí.
        useAuthStore.setState({ user: null, token: null });
    });

    if('setAuth guarda el usuario y el token', () => {
        const fakeUser = { id: '1', name: 'Rubén', role: 'companyAdmin' };
        useAuthStore.getState().setAuth(fakeUser, 'fake-jwt-token');

        const state = useAuthStore.getState();
        expect(state.user).toEqual(fakeUser);
        expect(state.token).toBe('fake-jwt-token');
    });

    it('logout limpia el usuario y el token', () => {
        useAuthStore.getState().setAuth({ id: '1'}, 'fake-token');
        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });
});