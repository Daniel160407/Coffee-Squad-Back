import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export async function registerPost(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    }).select("-password");

    generateToken(user._id, res);
    res.status(201).json({
      success: true,
      message: "user created successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}

export async function loginPost(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({
        success: false,
        message: "email or password incorrect",
        data: null,
      });

    const correctPassword = user.comparePassword(password);

    if (!correctPassword)
      return res.status(401).json({
        success: false,
        message: "email or password incorrect",
        data: null,
      });

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "user authenticated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}

export async function logoutPost(req, res) {
  try {
    // Clear the JWT token cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "user logged out successfully",
      data: null,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}

// Debug endpoint to test cookie functionality
export async function testCookie(req, res) {
  try {
    const cookies = req.cookies;
    const headers = req.headers;

    res.status(200).json({
      success: true,
      message: "Cookie test endpoint",
      data: {
        cookies: cookies,
        cookieHeader: headers.cookie,
        userAgent: headers["user-agent"],
        origin: headers.origin,
        referer: headers.referer,
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
