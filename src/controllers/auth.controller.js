import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export async function registerPost(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

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

    const user = await User.findOne({ email });

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

    generateToken({ userId: user._id }, res);

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
