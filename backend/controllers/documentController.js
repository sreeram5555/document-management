import Document from '../models/Document.js';
import bcrypt from "bcryptjs";

export const createDocument = async (req, res) => {
  const { title, content, viewPassword, editPassword } = req.body;

  if (!viewPassword || !editPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }

  const doc = new Document({
    title,
    content,
    viewPassword,   
    editPassword,  
    owner: req.user._id,  
  });

  try {
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const createDocument = async (req, res) => {
//   const { title, content, viewPassword, editPassword } = req.body;

//   if (!viewPassword || !editPassword) {
//     return res.status(400).json({ message: "Both passwords are required" });
//   }

//   try {
//     // Hash the passwords before saving
//     const hashedViewPassword = await bcrypt.hash(viewPassword, 10);
//     const hashedEditPassword = await bcrypt.hash(editPassword, 10);

//     const doc = new Document({
//       title,
//       content,
//       viewPassword: hashedViewPassword,
//       editPassword: hashedEditPassword,
//       owner: req.user._id,
//     });

//     await doc.save();
//     res.status(201).json(doc);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.query.user || req.user._id; // if query.user exists, get that user's docs
    const documents = await Document.find({ owner: userId });
    res.json(documents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const viewDocument = async (req, res) => {
//     const { password } = req.body;
//     const userId = req.user._id;

//     try {
//         const document = await Document.findById(req.params.id);
//         if (!document) return res.status(404).json({ message: 'Document not found' });

//         // Owner can always view
//         if (!document.owner.equals(userId)) {
//             const isMatch = document.viewPassword === password; // check view password
//             if (!isMatch) return res.status(401).json({ message: 'Incorrect viewership password' });
//         }

//         res.json({ title: document.title, content: document.content });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const viewDocument = async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Owner can always view
    if (!document.owner.equals(userId)) {
      const isMatch = await bcrypt.compare(password, document.viewPassword); // ✅ FIXED
      if (!isMatch) return res.status(401).json({ message: 'Incorrect viewership password' });
    }

    res.json({ title: document.title, content: document.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({
      _id: doc._id,
      title: doc.title,
      content: doc.content,
      owner: doc.owner.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// export const verifyPassword = async (req, res) => {
//   try {
//     const { editPassword } = req.body;
//     const doc = await Document.findById(req.params.id);

//     if (!doc) return res.status(404).json({ message: "Document not found" });

//     if (doc.editPassword && doc.editPassword === editPassword) {
//       return res.json({ success: true });
//     } else {
//       return res.json({ success: false });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const verifyPassword = async (req, res) => {
  try {
    const { editPassword } = req.body;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    // compare plain password with hashed password
    const isMatch = await bcrypt.compare(editPassword, doc.editPassword);

    if (isMatch) {
      return res.json({ success: true, message: "Password is correct" });
    } else {
      return res.json({ success: false, message: "Wrong password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//     export const getDocumentForEdit = async (req, res) => {
//     const { password } = req.body;
//     const userId = req.user._id;

//     try {
//         const document = await Document.findById(req.params.id);
//         if (!document) return res.status(404).json({ message: 'Document not found' });

//         // Owner can always edit
//         if (!document.owner.equals(userId)) {
//             const isMatch = document.editPassword === password; // check edit password
//             if (!isMatch) return res.status(401).json({ message: 'Incorrect editor password' });
//         }

//         res.json(document);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const getDocumentForEdit = async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Owner can always edit
    if (!document.owner.equals(userId)) {
      const isMatch = await bcrypt.compare(password, document.editPassword); // ✅ FIXED
      if (!isMatch) return res.status(401).json({ message: 'Incorrect editor password' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const updateDocument = async (req, res) => {
//     // Note: We now get editPassword from the body, not just 'password'
//     const { title, content, editPassword } = req.body;
//     const userId = req.user._id;

//     try {
//         const document = await Document.findById(req.params.id);
//         if (!document) {
//             return res.status(404).json({ message: 'Document not found' });
//         }

//         const isOwner = document.owner.equals(userId);

//         // Scenario 1: The user is the owner. They don't need a password.
//         if (isOwner) {
//             document.title = title || document.title;
//             document.content = content || document.content;
//             const updatedDocument = await document.save();
//             return res.json(updatedDocument);
//         }

//         // Scenario 2: The user is NOT the owner. They must provide the correct edit password.
//         // We do a simple string comparison since passwords are not hashed in your model.
//         if (document.editPassword && document.editPassword === editPassword) {
//             document.title = title || document.title;
//             document.content = content || document.content;
//             const updatedDocument = await document.save();
            
//             // Optional: Notify owner if edited by another user
//             if (!isOwner) {
//                 await Notification.create({
//                     user: document.owner,
//                     message: `${req.user.username} edited your document: "${document.title}"`,
//                     documentId: document._id,
//                 });
//             }
            
//             return res.json(updatedDocument);
//         }
        
//         // Scenario 3: Not the owner and password is wrong or missing.
//         return res.status(401).json({ message: 'Not authorized or incorrect editor password' });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const updateDocument = async (req, res) => {
  const { title, content, editPassword } = req.body;
  const userId = req.user._id;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const isOwner = document.owner.equals(userId);

    // Scenario 1: Owner (no password needed)
    if (isOwner) {
      document.title = title || document.title;
      document.content = content || document.content;
      const updatedDocument = await document.save();
      return res.json(updatedDocument);
    }

    // Scenario 2: Not owner → must match hashed password
    const isMatch = await bcrypt.compare(editPassword, document.editPassword); // ✅ FIXED
    if (isMatch) {
      document.title = title || document.title;
      document.content = content || document.content;
      const updatedDocument = await document.save();
      return res.json(updatedDocument);
    }

    return res.status(401).json({ message: 'Not authorized or incorrect editor password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (!document.owner.equals(req.user._id)) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};