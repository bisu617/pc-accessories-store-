import { Router } from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  getDashboardStats,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetUsers,
  adminUpdateUserRole,
  setupFirstAdmin,
  adminUploadImage,
  upload,
} from '../controllers/adminController.js';

const router = Router();

// All routes below require a valid JWT + admin role
router.use(auth, adminAuth);

// Dashboard
router.get('/stats', getDashboardStats);

// Products
router.get('/products', adminGetProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);
router.post('/upload', upload.single('image'), adminUploadImage);

// Orders
router.get('/orders', adminGetOrders);
router.put('/orders/:id/status', adminUpdateOrderStatus);

// Users
router.get('/users', adminGetUsers);
router.put('/users/:id/role', adminUpdateUserRole);

export default router;

// ─── First-admin setup (no auth required — only works once) ──────────────────
import { Router as BaseRouter } from 'express';
export const setupRouter = BaseRouter();
setupRouter.post('/setup-admin', setupFirstAdmin);
