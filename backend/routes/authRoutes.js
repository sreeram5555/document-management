import express from 'express';
import { signup, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;