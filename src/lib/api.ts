import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
	baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const authApi = {
	login: (nom: string, role: string) =>
		api.post('/auth/login', { nom, role }),

	checkDirecteur: () =>
		api.get('/auth/check-directeur'),
};

export const filesApi = {
	upload: (formData: FormData) =>
		api.post('/files/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		}),

	inbox: (userId: string) =>
		api.get(`/files/inbox/${userId}`),

	sent: (userId: string) =>
		api.get(`/files/sent/${userId}`),

	download: (transferId: string, filename: string) => {
		const url = `${BASE_URL}/files/download/${transferId}`;
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	},

	delete: (transferId: string, userId: string) =>
		api.delete(`/files/${transferId}`, { data: { userId } }),

	markAsRead: (transferId: string, userId: string) =>
		api.post(`/files/${transferId}/read`, { userId }),

	markAsUnread: (transferId: string, userId: string) =>
		api.post(`/files/${transferId}/unread`, { userId }),

	unreadCount: (userId: string) =>
		api.get(`/files/unread-count/${userId}`),

	all: () => api.get('/files/all'),
};

export default api;
