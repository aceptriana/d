import axios from 'axios';

const API_BASE = 'https://dramabox-api-rho.vercel.app';

export const api = {
    getHome: async (page = 1, size = 10) => {
        const response = await axios.get(`${API_BASE}/api/home`, { params: { page, size } });
        return response.data;
    },
    search: async (keyword, page = 1) => {
        const response = await axios.get(`${API_BASE}/api/search`, { params: { keyword, page } });
        return response.data;
    },
    getDetail: async (bookId) => {
        const response = await axios.get(`${API_BASE}/api/detail/${bookId}/v2`);
        return response.data;
    },
    getChapters: async (bookId) => {
        const response = await axios.get(`${API_BASE}/api/chapters/${bookId}`);
        return response.data;
    },
    getStream: async (bookId, episode) => {
        const response = await axios.get(`${API_BASE}/api/stream`, { params: { bookId, episode } });
        return response.data;
    },
    getVip: async () => {
        const response = await axios.get(`${API_BASE}/api/vip`);
        return response.data;
    },
    getDubbed: async (page = 1, size = 20) => {
        const response = await axios.get(`${API_BASE}/api/dubbed`, { params: { page, size } });
        return response.data;
    },
    getCategories: async () => {
        const response = await axios.get(`${API_BASE}/api/categories`);
        return response.data;
    },
    getByCategory: async (id, page = 1, size = 10) => {
        const response = await axios.get(`${API_BASE}/api/category/${id}`, { params: { page, size } });
        return response.data;
    },
    getRecommend: async () => {
        const response = await axios.get(`${API_BASE}/api/recommend`);
        return response.data;
    },
};
