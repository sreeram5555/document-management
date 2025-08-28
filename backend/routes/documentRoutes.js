import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createDocument,
  getUserDocuments,
  viewDocument,
  getDocument,
  
  updateDocument,
  deleteDocument,
  getDocumentForEdit,
  verifyPassword
} from '../controllers/documentController.js';

const router = express.Router();

router.route('/').post(protect, createDocument).get(protect, getUserDocuments);
router.route('/:id')
  .get(protect, getDocument)   // 👈 add this
  .delete(protect, deleteDocument);
router.route('/:id/view').post(protect, viewDocument);
router.route('/:id/edit').post(protect, getDocumentForEdit).put(protect, updateDocument);
router.post("/:id/verify-password", protect, verifyPassword);
router.post("/", protect, createDocument);

export default router;