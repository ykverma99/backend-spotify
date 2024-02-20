import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  authOUserId: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  DOB: { type: Date },
});

const User = mongoose.model("User", userSchema);

export default User;
