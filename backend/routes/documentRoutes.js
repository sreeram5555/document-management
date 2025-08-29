// import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
// import {
//   createDocument,
//   getUserDocuments,
//   viewDocument,
//   getDocument,
//   getAllPasswords,
//   updateDocument,
//   deleteDocument,
//   getDocumentForEdit,
//   verifyPassword,
//   getOwnerPasswords
// } from '../controllers/documentController.js';

// const router = express.Router();

// router.route('/').post(protect, createDocument).get(protect, getUserDocuments);
// router.route('/:id')
//   .get(protect, getDocument)   // 👈 add this
//   .delete(protect, deleteDocument);
// router.route('/:id/view').post(protect, viewDocument);
// router.route('/:id/edit').post(protect, getDocumentForEdit).put(protect, updateDocument);
// router.post("/:id/verify-password", protect, verifyPassword);
// router.post("/", protect, createDocument);
// router.get("/passwords", protect, getOwnerPasswords);
// router.get("/passwords/all", protect, getAllPasswords);


// export default router;

// routes/documentRoutes.js
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

// ✅ Get all user docs / Create new doc
router.route('/')
  .post(protect, createDocument)
  .get(protect, getUserDocuments);

// ✅ Single document routes
router.route('/:id')
  .get(protect, getDocument)
  .delete(protect, deleteDocument);

// ✅ View & edit routes
router.route('/:id/view').post(protect, viewDocument);
router.route('/:id/edit')
  .post(protect, getDocumentForEdit)
  .put(protect, updateDocument);

// ✅ Password routes
router.post('/:id/verify-password', protect, verifyPassword);
router.get('/passwords', protect, getOwnerPasswords);
router.get('/passwords/all', protect, getAllPasswords);

export default router;
