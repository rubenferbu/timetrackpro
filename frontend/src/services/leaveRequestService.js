import api from './api';

const leaveRequestService = {
    async create(data) {
        const response = await api.post('/leave-requests', data);
        return response.data.data;
    },

    async listMine(params = {}) {
        const response = await api.get('/leave-requests', { params });
        return response.data;
    },
};

export default leaveRequestService;