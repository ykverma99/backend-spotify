import express from "express";
import bcrypt from "bcrypt";
import Artist from "../model/artistModel.js";
import { Types } from "mongoose";
import upload from "../middleware/multer.js";
import storeCloud from "../middleware/storeCloud.js";

const router = express.Router();

router.get("/artist", async (req, res) => {
  try {
    // in this popuate we want to add populate
    const artists = await Artist.find()
      .populate({
        path: "album",
        populate: {
          path: "songs",
          model: "Songs",
        },
      })
      .populate({
        path: "single",
        populate: {
          path: "songs",
          model: "Songs",
        },
      });
    res.json({ data: artists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/artist/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let user = null;
    if (isObjectId) {
      user = await Artist.findById(identifier)
        .populate({
          path: "album",
          populate: {
            path: "songs",
            model: "Songs",
          },
        })
        .populate({
          path: "single",
          populate: {
            path: "songs",
            model: "Songs",
          },
        });
    } else {
      user = await Artist.find({
        $or: [{ email: identifier }, { name: identifier }],
      })
        .populate({
          path: "album",
          populate: {
            path: "songs",
            model: "Songs",
          },
        })
        .populate({
          path: "single",
          populate: {
            path: "songs",
            model: "Songs",
          },
        });
    }
    if (!user) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/artist/:artistId",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const body = req.body;
      const { artistId } = req.params;

      if (req.file) {
        const result = await storeCloud(req.file.path, "auto");
        body.profilePhoto = result;
      }
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }
      const artistUpdate = await Artist.findByIdAndUpdate(artistId, body, {
        new: true,
      });
      if (!artistUpdate) {
        res.status(400).json({ error: "Artist is Not Updated" });
        return;
      }
      res.status(200).json({ data: artistUpdate });
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
    let user = null;
    if (isObjectId) {
      user = await Artist.findByIdAndDelete(identifier);
    } else {
      user = await Artist.findOneAndDelete({ email: identifier });
    }
    if (!user) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ message: "User is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
