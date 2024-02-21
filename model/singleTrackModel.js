import mongoose from "mongoose";

const singleTrackSchema = new mongoose.Schema({
  trackName: String,
  trackImage: String,
  artist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  songs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Songs",
  },

  created_at: { type: Date, default: Date.now },
});

const Track = mongoose.model("Track", singleTrackSchema);

export default Track;
