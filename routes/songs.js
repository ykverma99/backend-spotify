import express from "express";
import Songs from "../model/songModel.js";
import upload from "../middleware/multer.js";
import storeCloud from "../middleware/storeCloud.js";

const router = express.Router();

router.post("/song", upload.single("songUrl"), async (req, res) => {
  try {
    const { songName, songUrl, artist, track, album } = req.body;
    let storeImage;
    if (req.file) {
      storeImage = await storeCloud(req.file.path, "auto");
    }

    const song = new Songs({
      songUrl: storeImage,
      songName,
      artist,
      track,
      album,
    });
    const songSave = await song.save();
    res.status(200).json({ message: "Songs Create", data: songSave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/song", async (req, res) => {
  try {
    const song = await Songs.find();
    res.status(200).json({ data: song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/song/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const song = await Songs.find({ songName: name });
    if (!song) {
      res.status(401).json({ error: "No Songs Found" });
      return;
    }
    res.status(200).json({ data: song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/song/:trackId",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const body = req.body;
      const { trackId } = req.params;

      if (req.file) {
        const result = await storeCloud(req.file.path, "auto");
        body.songUrl = result;
      }
      const albumUpdate = await Songs.findByIdAndUpdate(trackId, body, {
        new: true,
      });
      if (!albumUpdate) {
        res.status(400).json({ error: "Songs is Not Updated" });
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
    let song = null;
    if (isObjectId) {
      song = await Songs.findByIdAndDelete(identifier);
    } else {
      song = await Songs.findOneAndDelete({ songName: identifier });
    }
    if (!song) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ message: "Songs is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
