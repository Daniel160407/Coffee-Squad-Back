import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("access_token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevents XSS (cross-site scripting) attacks
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // more flexible for development
    secure: process.env.NODE_ENV === "production",
    path: "/", // ensure cookie is available for all routes
  });

  return token;
};

export default generateToken;
