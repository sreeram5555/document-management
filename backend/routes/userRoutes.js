import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    searchUsers, 
    getNotifications, 
    markNotificationsRead,
    deleteNotification 
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(protect, searchUsers);
router.route('/notifications').get(protect, getNotifications).put(protect, markNotificationsRead);
router.route('/notifications/:id').delete(protect, deleteNotification);

export default router;