import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  authOUserId: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  DOB: { type: Date },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("passwod")) {
    user.passwod = await bcrypt.hash(user.passwod, 10);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
