const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getMyOrders,
    updateOrderToPaid,
    createPaymentIntent,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Protected routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
