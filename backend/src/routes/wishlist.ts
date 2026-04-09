import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getWishlist);
router.post('/:productId', auth, toggleWishlist);

export default router;
