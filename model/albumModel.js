import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumName: String,
  albumImage: String,
  artist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
    },
  ],

  created_at: { type: Date, default: Date.now },
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
