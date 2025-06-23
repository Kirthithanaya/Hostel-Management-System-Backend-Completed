import Notification from "../models/Notification.js";

// Create and send a notification
export const createNotification = async (req, res) => {
  try {
    const { residentName, type, message } = req.body;

    if (!residentName || !type || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const notification = new Notification({ residentName, type, message });
    await notification.save();

    res.status(201).json({ message: "Notification sent", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
};
