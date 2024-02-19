import jwt from "jsonwebtoken";
import pkg from "express-openid-connect";
const { auth, requiresAuth } = pkg;

const authenticate = (req, res, next) => {
  const authOToken = req.headers.authorization;

  if (authOToken) {
    auth()(req, res, next);
  } else {
    const jwtToken = req.headers.authorization;
    if (jwtToken) {
      jwt.verify(jwtToken, process.env.AuthSecretKey, (err, user) => {
        if (err) {
          return res.status(401).json({ error: "Invalid JWT token" });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
};

export default authenticate;
