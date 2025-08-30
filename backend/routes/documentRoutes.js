 

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createDocument,
  getUserDocuments,
  viewDocument,
  getDocument,
  getAllPasswords,
  updateDocument,
  deleteDocument,
  getDocumentForEdit,
  verifyPassword,
  getOwnerPasswords
} from '../controllers/documentController.js';

const router = express.Router();

// ✅ Create + Get documents
router.route('/')
  .post(protect, createDocument)
  .get(protect, getUserDocuments);

// ✅ Single document routes
router.route('/:id')
  .get(protect, getDocument)
  .delete(protect, deleteDocument);

// ✅ Special routes
router.route('/:id/view').post(protect, viewDocument);
router.route('/:id/edit').post(protect, getDocumentForEdit).put(protect, updateDocument);
router.post("/:id/verify-password", protect, verifyPassword);

// ✅ Passwords
router.get("/passwords", protect, getOwnerPasswords);
router.get("/passwords/all", protect, getAllPasswords);

export default router;
