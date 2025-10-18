import User from "../models/user.model.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "successfully found all the users",
        data: users,
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}
