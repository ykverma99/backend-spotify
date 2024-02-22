import express from "express";
import Album from "../model/albumModel.js";
import upload from "../middleware/multer.js";
import storeCloud from "../middleware/storeCloud.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/album", upload.single("albumImage"), async (req, res) => {
  try {
    const { albumName, albumImage, artist, songs } = req.body;
    let storeImage;
    if (req.file) {
      storeImage = await storeCloud(req.file.path);
    }

    const album = new Album({
      albumImage: storeImage,
      albumName,
      artist,
      songs,
    });
    const saveAlbum = await album.save();
    res.status(200).json({ message: "Album Create", data: saveAlbum });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/album", async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json({ data: albums });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/album/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const album = await Album.find({ albumName: name });
    if (!album) {
      res.status(401).json({ error: "No Album Found" });
      return;
    }
    res.status(200).json({ data: album });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/album/:albumId",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const body = req.body;
      const { albumId } = req.params;

      if (req.file) {
        const result = await storeCloud(req.file.path);
        body.albumImage = result;
      }
      const albumUpdate = await Album.findByIdAndUpdate(albumId, body, {
        new: true,
      });
      if (!albumUpdate) {
        res.status(400).json({ error: "Album is Not Updated" });
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
    let album = null;
    if (isObjectId) {
      album = await Album.findByIdAndDelete(identifier);
    } else {
      album = await Album.findOneAndDelete({ albumName: identifier });
    }
    if (!album) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ message: "Album is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
