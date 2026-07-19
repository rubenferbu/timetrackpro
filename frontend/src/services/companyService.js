import api from './api';

const companyService = {
    async list(params = {}) {
        const response = await api.get('/companies', { params });
        return response.data;
    },
    async updateStatus(id, status) {
        const response = await api.patch(`/companies/${id}`, { status });
        return response.data.data;
    },
};
export default companyService;