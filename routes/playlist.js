import express from "express";
import User from "../model/userModel.js";
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
    console.log(savePlaylist);
    const findUser = await User.findById(user);
    findUser.playlist.push(savePlaylist._id);
    await findUser.save();
    const sendUser = await User.findById(user).populate({
      path: "playlist",
      model: "Playlist",
      populate: [
        { path: "track", model: "Track" },
        { path: "album", model: "Album" },
      ],
    });
    res.status(200).json({ message: "playlistcreate", data: sendUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/playlist", async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate({
        path: "songs",
        model: "Songs",
        populate: [
          {
            path: "track",
            model: "Track", // Assuming 'track' is a reference to the Track model
          },
          {
            path: "album",
            model: "Album",
          },
        ],
      })
      .populate("user track album");
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
      playlist = await Playlist.findById(identifier)
        .populate({
          path: "songs",
          model: "Songs",
          populate: [
            {
              path: "track",
              model: "Track", // Assuming 'track' is a reference to the Track model
            },
            {
              path: "album",
              model: "Album",
            },
            {
              path: "artist",
              model: "Artist",
            },
          ],
        })
        .populate({
          path: "track",
          model: "Track",
          populate: [
            {
              path: "artist",
              model: "Artist",
            },
            {
              path: "songs",
              model: "Songs",
            },
          ],
        })
        .populate({
          path: "album",
          model: "Album",
          populate: [
            {
              path: "artist",
              model: "Artist",
            },
            {
              path: "songs",
              model: "Songs",
            },
          ],
        })
        .populate("user");
    } else {
      playlist = await Playlist.findOne({ playlistName: identifier })
        .populate({
          path: "songs",
          model: "Songs",
          populate: [
            {
              path: "track",
              model: "Track", // Assuming 'track' is a reference to the Track model
            },
            {
              path: "album",
              model: "Album",
            },
          ],
        })
        .populate({
          path: "track",
          model: "Track",
          populate: [
            {
              path: "artist",
              model: "Artist",
            },
            {
              path: "songs",
              model: "Songs",
            },
          ],
        })
        .populate({
          path: "album",
          model: "Album",
          populate: {
            path: "artist",
            model: "Artist",
          },
        })
        .populate("user");
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
