import api from './api';

const authService = {
    async registerCompany(data) {
        const response = await api.post('/auth/register-company', data);
        return response.data.data;
    },

    async login(email, password){
        const response = await api.post('/auth/login', { email, password});
        return response.data.data;
    },

    async me() {
        const response = await api.get('/auth/me');
        return response.data.data;
    },
};

export default authService;