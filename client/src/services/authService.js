import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    googleLogin: async (credential) => {
        const response = await api.post('/auth/google', { credential });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    facebookLogin: async (accessToken, userID) => {
        const response = await api.post('/auth/facebook', { accessToken, userID });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        await api.get('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/updateprofile', userData);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
    },

    updatePassword: async (passwords) => {
        const response = await api.put('/auth/updatepassword', passwords);
        return response.data;
    }
};

