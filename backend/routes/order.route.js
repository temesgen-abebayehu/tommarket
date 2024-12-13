import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderToDelivered, updateOrderToPaid, deleteOrder } from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/pay', authMiddleware, updateOrderToPaid);
router.put('/:id/deliver', authMiddleware, updateOrderToDelivered);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;
