import User from "../models/user.model.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json({
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

export async function deleteExistingUser(req, res) {
  const { id } = req.params;
  await User.deleteOne({ _id: id });

  res
    .status(200)
    .json({ success: true, message: "user successfully deleted", data: null });
}

export async function updateUserInfo(req, res) {
  const {
    age,
    gender,
    height,
    currentWeight,
    targetWeight,
    fitnessGoal,
    activityLevel,
    availableEquipment,
    dietaryPreference,
  } = req.body;

  await User.updateOne;
}
