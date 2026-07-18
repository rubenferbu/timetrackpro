import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';
import api from './api';

const teamService = {
    async listTimeEntries(params = {}) {
        const response = await api.get('/time-entries/team', { params });
        return response.data;
    },

    async listLeaveRequests(params = {}) {
        const response = await api.get('/leave-requests/team', { params });
        return response.data;
    },

    async approveLeaveRequest(id) {
        const response = await api.patch(`/leave-requests/${id}/approve`);
        return response.data.data;
    },

    async rejectLeaveRequest(id) {
        const response = await api.patch(`/leave-requests/${id}/reject`);
        return response.data.data;
    },
};

export default teamService;