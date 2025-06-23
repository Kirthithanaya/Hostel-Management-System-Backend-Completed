import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
  res.json(updatedUser);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted" });
};
