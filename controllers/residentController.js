import Resident from "../models/Resident.js";

// Create resident
export const createResident = async (req, res) => {
  try {
    const resident = new Resident(req.body);
    await resident.save();
    res.status(201).json({ message: "Resident added", resident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add resident", error: error.message });
  }
};

// Get all residents
export const getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find();
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch residents" });
  }
};

// Get single resident
export const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident)
      return res.status(404).json({ message: "Resident not found" });
    res.json(resident);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resident" });
  }
};

// Update resident
export const updateResident = async (req, res) => {
  try {
    const updated = await Resident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Resident updated", resident: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating resident" });
  }
};

// Delete resident
export const deleteResident = async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.json({ message: "Resident deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resident" });
  }
};
