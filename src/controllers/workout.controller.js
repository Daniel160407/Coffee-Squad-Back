import mongoose from "mongoose";
import Workout from "../models/workout.model.js";

export async function createWorkoutCard(req, res) {
  try {
    const {
      type,
      distance,
      pace,
      notes,
      title,
      totalDuration,
      caloriesBurned,
    } = req.body;

    const userID = req.user._id;

    const card = await Workout.create({
      type,
      distance,
      pace,
      notes,
      title,
      totalDuration,
      caloriesBurned,
      userId: userID,
    });

    res.status(201).json({
      success: true,
      message: "workout card created successfully",
      data: card,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}

export async function getWorkoutCards(req, res) {
  try {
    const cards = await Workout.find({});

    res
      .status(200)
      .json({ success: true, message: "found some cards", data: cards });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: error });
  }
}
