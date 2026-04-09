import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:productId', auth, updateCartItem);
router.delete('/:productId', auth, removeFromCart);
router.delete('/', auth, clearCart);

export default router;
