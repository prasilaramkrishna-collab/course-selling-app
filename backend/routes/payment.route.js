import express from 'express';
import { createOrder, verifyPayment, getPaymentStatus } from '../controllers/payment.controller.js';
import userMiddleware from '../middlewares/user.mid.js';

const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', userMiddleware, createOrder);

// POST /api/payment/verify-payment
router.post('/verify-payment', userMiddleware, verifyPayment);

// GET /api/payment/status/:orderId
router.get('/status/:orderId', userMiddleware, getPaymentStatus);

export default router;
