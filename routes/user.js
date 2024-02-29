import express from "express";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import User from "../model/userModel.js";

const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    // in this popuate we want to add populate
    const users = await User.find().populate({
      path: "playlist",
      model: "Playlist",
      populate: [
        { path: "track", model: "Track" },
        { path: "album", model: "Album" },
      ],
    });
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let user = null;
    if (isObjectId) {
      user = await User.findById(identifier).populate({
        path: "playlist",
        model: "Playlist",
        populate: [
          { path: "track", model: "Track" },
          { path: "album", model: "Album" },
        ],
      });
    } else {
      user = await User.find({
        $or: [{ email: identifier }, { name: identifier }],
      }).populate({
        path: "playlist",
        model: "Playlist",
        populate: [
          { path: "track", model: "Track" },
          { path: "album", model: "Album" },
        ],
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

router.patch("/user/:userId", async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.params;
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const userUpdate = await User.findByIdAndUpdate(userId, body, {
      new: true,
    });
    if (!userUpdate) {
      res.status(400).json({ error: "User is Not Updated" });
      return;
    }
    res.status(200).json({ data: userUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/user/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let user = null;
    if (isObjectId) {
      user = await User.findByIdAndDelete(identifier);
    } else {
      user = await User.findOneAndDelete({ email: identifier });
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
