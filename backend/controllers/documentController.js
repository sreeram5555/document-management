import Document from '../models/Document.js';
import bcrypt from "bcryptjs";   
import Notification from '../models/Notification.js'; 




export const createDocument = async (req, res) => {
    try {
        const { title, content, viewPassword, editPassword } = req.body;

        if (!title || !viewPassword || !editPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Hash passwords
        const hashedEditPassword = await bcrypt.hash(editPassword, 10);
        const hashedViewPassword = await bcrypt.hash(viewPassword, 10);

        const document = await Document.create({
            title,
            content,
            editPassword ,
            viewPassword,
            owner: req.user ? req.user._id : null
        });

        res.status(201).json(document);
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: error.message || "Server error while creating document" });
    }
};



export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.query.user || req.user._id; 
    const documents = await Document.find({ owner: userId });
    res.json(documents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getOwnerPasswords = async (req, res) => {
  try {
    const userId = req.user._id;

    const documents = await Document.find({ owner: userId })
      .select("title viewPassword editPassword");

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPasswords = async (req, res) => {
  try {
    const userId = req.user._id;

    const docs = await Document.find({ owner: userId }).select(
      "title viewPassword editPassword"
    );

    res.json(docs);
  } catch (error) {
    console.error("Error fetching passwords:", error);
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

export const verifyPassword = async (req, res) => {
  try {
    const { editPassword } = req.body;
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

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


export const updateDocument = async (req, res) => {
  const { title, content, editPassword, newEditPassword, newViewPassword } = req.body;
  const userId = req.user._id;

  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const isOwner = document.owner.equals(userId);

    // Scenario 1: Owner → can update without old password
    if (isOwner) {
      document.title = title || document.title;
      document.content = content || document.content;

      if (newEditPassword) {
        document.editPassword = await bcrypt.hash(newEditPassword, 10);
      }
      if (newViewPassword) {
        document.viewPassword = await bcrypt.hash(newViewPassword, 10);
      }

      const updatedDocument = await document.save();
      return res.json(updatedDocument);
    }

    // Scenario 2: Not owner → must match existing password
    const isMatch = await bcrypt.compare(editPassword, document.editPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Not authorized or incorrect editor password' });
    }

    document.title = title || document.title;
    document.content = content || document.content;

    const updatedDocument = await document.save();
    await Notification.create({
      user: document.owner,
      message: `${req.user.username} edited your document "${document.title}"`,
    });
    
    return res.json(updatedDocument);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id)) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await document.deleteOne();

    return res.status(200).json({ success: true, message: 'Document removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting document', error: error.message });
  }
};
