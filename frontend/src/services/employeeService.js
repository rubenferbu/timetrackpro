import api from './api';

const employeeService = {
    async list(params = {}) {
        const response = await api.get('/users', { params });
        return response.data;
    },

    async create(data) {
        const response = await api.post('/users', data);
        return response.data.data;
    },

    async update(id, data) {
        const response = await api.patch(`/users/${id}`, data);
        return response.data.data;
    },

    async deactivate(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data.data;
    },
};

export default employeeService;