
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DocumentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Please add a title'], trim: true },
  content: { type: String, default: '' },
  editPassword: { type: String, required: true },
  viewPassword: { type: String, required: true },
}, { timestamps: true });

DocumentSchema.pre('save', async function (next) {
  if (this.isModified('editPassword')) {
      const salt = await bcrypt.genSalt(10);
      this.editPassword = await bcrypt.hash(this.editPassword, salt);
  }
  if (this.isModified('viewPassword')) {
      const salt = await bcrypt.genSalt(10);
      this.viewPassword = await bcrypt.hash(this.viewPassword, salt);
  }
  next();
});

DocumentSchema.methods.matchEditPassword = async function (enteredPassword, userId) {
  if (this.owner.equals(userId)) return true;
  return await bcrypt.compare(enteredPassword, this.editPassword);
};

DocumentSchema.methods.matchViewPassword = async function (enteredPassword, userId) {
  if (this.owner.equals(userId)) return true;
  return await bcrypt.compare(enteredPassword, this.viewPassword );
};

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
