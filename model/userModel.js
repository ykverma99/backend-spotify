import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  authOUserId: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  DOB: { type: Date },
  artist: { type: Boolean, default: false },
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
