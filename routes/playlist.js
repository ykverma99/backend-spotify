import express from "express";
import Songs from "../model/songModel.js";
import upload from "../middleware/multer.js";
import storeCloud from "../middleware/storeCloud.js";
import { Types } from "mongoose";
import Playlist from "../model/playlistModel.js";

const router = express.Router();

router.post("/playlist", async (req, res) => {
  try {
    const { playlistName, user, madeBy, songs, track, album } = req.body;

    const playlist = new Playlist({
      playlistName,
      madeBy,
      songs,
      track,
      album,
      user,
    });
    const savePlaylist = await playlist.save();
    res.status(200).json({ message: "playlistcreate", data: savePlaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/playlist", async (req, res) => {
  try {
    const playlists = await Playlist.find().populate("user songs track album");
    res.status(200).json({ data: playlists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/playlist/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let playlist;
    if (isObjectId) {
      playlist = await Playlist.findById(identifier).populate(
        "user songs track album"
      );
    } else {
      playlist = await Playlist.findOne({ playlistName: identifier }).populate(
        "user songs track album"
      );
    }
    if (!playlist) {
      res.status(400).json({ error: "No User Found" });
      return;
    }
    res.status(200).json({ data: playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/playlist/:id", async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;

    // Check if the playlist exists
    const existingPlaylist = await Playlist.findById(id);

    if (!existingPlaylist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Assuming songs is an array of song objects in the request body
    const { songs } = body;

    // Update the playlist with the new songs
    existingPlaylist.songs.push(...songs);

    // Save the updated playlist
    const updatedPlaylist = await existingPlaylist.save();

    res
      .status(200)
      .json({ message: "Playlist updated", data: updatedPlaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/playlist/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let playlist = null;
    if (isObjectId) {
      playlist = await Artist.findByIdAndDelete(identifier);
    } else {
      playlist = await Artist.findOneAndDelete({ playlistName: identifier });
    }
    if (!playlist) {
      res.status(400).json({ error: "No playist Found" });
      return;
    }
    res.status(200).json({ message: "playist is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
