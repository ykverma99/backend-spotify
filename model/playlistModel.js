import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  playlistName: String,
  madeBy: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
    },
  ],
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Track",
  },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  created_at: { type: Date, default: Date.now },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
