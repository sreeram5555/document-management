// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from './routes/documentRoutes.js';
// import { searchUsers, getNotifications } from './controllers/userController.js';
// import  {protect}  from '../middleware/authMiddleware.js';
import { searchUsers,getNotifications } from "./controllers/userController.js";
import { protect } from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());


app.use(cors());

const allowedOrigins = [
  "http://localhost:5173",                   
  "https://document-management-b6lp.onrender.com" // 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// routes

app.use("/auth", authRoutes);
app.use('/documents', documentRoutes);
app.get('/users', protect, searchUsers);
app.get('/notifications', protect, getNotifications);
app.use("/users", userRoutes);



// app.get("/:id", protect, getDocumentById);

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
