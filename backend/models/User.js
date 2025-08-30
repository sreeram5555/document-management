import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: { type: String, required: true, minlength: 6, select: false },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });


UserSchema.pre("save", function(next) {
  if (this.isModified("editPassword")) {
    this.editPassword = encrypt(this.editPassword);
  }
  if (this.isModified("viewPassword")) {
    this.viewPassword = encrypt(this.viewPassword);
  }
  next();
});


// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
