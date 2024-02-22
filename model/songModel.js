import mongoose from "mongoose";

const songsSchema = new mongoose.Schema({
  songName: String,
  songUrl: String,
  artist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Track",
  },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  created_at: { type: Date, default: Date.now },
});

const Songs = mongoose.model("Songs", songsSchema);

export default Songs;
