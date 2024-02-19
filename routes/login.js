import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password, authOUserId } = req.body;
    let user;
    if (authOUserId) {
      user = await User.findOne({ authOUserId });
    } else {
      user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.passwod))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ email: user.email }, process.env.AuthSecretKey, {
      expiresIn: "1d",
    });
    res.json({ message: "User login", data: { user, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
});

export default router;