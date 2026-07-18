import { Await } from 'react-router-dom';
import api from './api';

const timeEntryService = {
    async clockIn() {
        const response = await api.post('/time-entries/clock-in');
        return response.data.data;
    },

    async clockOut(notes) {
        const response = await api.post('/time-entries/clock-out', { notes });
        return response.data.data
    },

    async listMine(params = {}) {
        const response = await api.get('/time-entries', { params });
        return response.data;
    },
};

export default timeEntryService;