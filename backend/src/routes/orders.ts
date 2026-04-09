import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);

export default router;
