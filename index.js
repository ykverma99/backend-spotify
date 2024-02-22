import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import pkg from "express-openid-connect";
import cors from "cors";
import register from "./routes/register.js";
import login from "./routes/login.js";
import artist from "./routes/artist.js";
import user from "./routes/user.js";
import album from "./routes/album.js";
import singleTrack from "./routes/singleTrack.js";
import authenticate from "./middleware/authenticate.js";
const { auth, requiresAuth } = pkg;

const app = express();
const port = process.env.Port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

const dbConnect = process.env.MongoDb;
const connectToDb = async () => {
  try {
    await mongoose.connect(dbConnect);
    console.log("DB Connected");
  } catch (error) {
    console.log("Mongoose error", error);
  }
};
connectToDb();

// Auth configuration

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `http://localhost/${port}`,
  clientID: "fM8Fpatg9lXhcLPS3NSTEOPb6mBv0RTB",
  issuerBaseURL: "https://dev-6mhgsugoalkijgk7.us.auth0.com",
  secret: "5uKpUhUSTH1GCdMUrDFtlMesnEdjJtbsTNoCByxZ3uXH3KM-Ei5sISFS44gkZkpH",
};

app.use(auth(authConfig));

app.get("/protect", authenticate, (req, res) => {
  res.json({ message: "This is a protected API route", user: req.user });
});

app.use(register);
app.use(login);
app.use(artist);
app.use(user);
app.use(album);
app.use(singleTrack);

app.listen(port, () => {
  console.log(`server is listing on http://localhost/${port}`);
});
