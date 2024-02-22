import express from "express";
import Track from "../model/singleTrackModel.js";
import upload from "../middleware/multer.js";
import storeCloud from "../middleware/storeCloud.js";

const router = express.Router();

router.post("/track", upload.single("trackImage"), async (req, res) => {
  try {
    const { trackName, trackImage, artist, songs } = req.body;
    let storeImage;
    if (req.file) {
      storeImage = await storeCloud(req.file.path);
    }

    const track = new Track({
      trackImage: storeImage,
      trackName,
      artist,
      songs,
    });
    const saveTrack = await track.save();
    res.status(200).json({ message: "Track Create", data: saveTrack });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/track", async (req, res) => {
  try {
    const track = await Track.find();
    res.status(200).json({ data: track });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/track/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const track = await Track.find({ trackName: name });
    if (!track) {
      res.status(401).json({ error: "No Track Found" });
      return;
    }
    res.status(200).json({ data: track });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/track/:trackId",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const body = req.body;
      const { trackId } = req.params;

      if (req.file) {
        const result = await storeCloud(req.file.path);
        body.trackImage = result;
      }
      const albumUpdate = await Track.findByIdAndUpdate(trackId, body, {
        new: true,
      });
      if (!albumUpdate) {
        res.status(400).json({ error: "Track is Not Updated" });
        return;
      }
      res.status(200).json({ data: albumUpdate });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete("/artist/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let track = null;
    if (isObjectId) {
      track = await Track.findByIdAndDelete(identifier);
    } else {
      track = await Track.findOneAndDelete({ trackName: identifier });
    }
    if (!track) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ message: "Track is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
