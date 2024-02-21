import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  profilePhoto: { type: String },
  album: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  single: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SingleTrack",
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
