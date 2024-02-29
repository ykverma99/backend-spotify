import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import Artist from "../model/artistModel.js";
import Playlist from "../model/playlistModel.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password, authOUserId } = req.body;
    let user;
    if (authOUserId) {
      user = await User.findOne({ authOUserId }).populate({
        path: "playlist",
        model: "Playlist",
        populate: [
          { path: "track", model: "Track" },
          { path: "album", model: "Album" },
        ],
      });
    } else {
      user = await User.findOne({ email }).populate({
        path: "playlist",
        model: "Playlist",
        populate: [
          { path: "track", model: "Track" },
          { path: "album", model: "Album" },
        ],
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }
    const token = jwt.sign({ email: user.email }, process.env.AuthSecretKey, {
      expiresIn: "1d",
    });
    res.json({ message: "User login", data: { ...user._doc, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.post("/login/artist", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    if (email) {
      user = await Artist.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }
    res.json({ message: "Artist login", data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

export default router;
