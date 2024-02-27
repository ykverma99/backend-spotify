import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Artist from "../model/artistModel.js";
import bcrypt from "bcrypt";
import Playlist from "../model/playlistModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const body = req.body;
  try {
    const existingUserEmail = await User.findOne({ email: body.email }).exec();

    if (existingUserEmail) {
      //   console.log(existingUserEmail);
      return res.status(400).json({ error: "Email is already exist" });
    }
    if (body.authOUserId) {
      const existingUserAuth = await User.findOne({
        authOUserId: body.authOUserId,
      }).exec();

      if (existingUserAuth) {
        return res
          .status(400)
          .json({ error: "Auth0 user ID is already exist" });
      }
    }
    const dob = body.DOB.length > 0 ? body.DOB : new Date();
    const password = await bcrypt.hash(body.password, 10);
    const user = new User({
      email: body.email,
      password: password,
      DOB: dob,
      name: body.name,
      authOUserId: body.authOUserId,
    });
    const saveUser = await user.save();
    const token = jwt.sign({ email: user.email }, process.env.AuthSecretKey, {
      expiresIn: "1d",
    });
    const { playlistName, madeBy, songs, track, album } = req.body;

    const playlist = new Playlist({
      playlistName: "Liked Songs",
      madeBy: "playlist",
      user: saveUser._id,
    });
    const savePlaylist = await playlist.save();
    saveUser.playlist.push(savePlaylist._id);
    res.status(201).json({
      message: "User is registered",
      data: { ...saveUser._doc, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// artist register

router.post("/register/artist", async (req, res) => {
  const { name, email, password, profilePhoto, album, single } = req.body;

  try {
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      res.status(401).json({ error: "Email is Already exist" });
      return;
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const artist = await Artist.create({
        email,
        name,
        password: hashPassword,
        profilePhoto,
        album,
        single,
      });
      const saveArtst = await artist.save();

      res.status(201).json({
        message: "Artist registered",
        data: { saveArtst },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});
export default router;
