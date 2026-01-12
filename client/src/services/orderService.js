import api from './api';

export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data;
    },

    updateOrderToPaid: async (id, paymentResult) => {
        const response = await api.put(`/orders/${id}/pay`, paymentResult);
        return response.data;
    },

    createPaymentIntent: async (amount) => {
        const response = await api.post('/orders/create-payment-intent', { amount });
        return response.data;
    },

    // Admin endpoints
    getAllOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/orders/admin/all?${queryString}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },

    getOrderStats: async () => {
        const response = await api.get('/orders/admin/stats');
        return response.data;
    }
};
