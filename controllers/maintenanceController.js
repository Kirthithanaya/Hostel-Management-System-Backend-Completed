import MaintenanceRequest from "../models/MaintenanceRequest.js";
// Resident creates a maintenance request using residentName
export const createMaintenanceRequest = async (req, res) => {
  try {
    const { residentName, roomNumber, issue, priority } = req.body;

    if (!residentName || !roomNumber || !issue) {
      return res.status(400).json({
        message: "Resident name, room number, and issue are required.",
      });
    }

    const newRequest = new MaintenanceRequest({
      residentName,
      roomNumber,
      issue,
      priority,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Maintenance request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Resident : GET My Request

export const getMyMaintenanceRequests = async (req, res) => {
  try {
    const residentName = req.user.name; // name is coming from authenticated JWT

    const requests = await MaintenanceRequest.find({ residentName }).sort({
      createdAt: -1,
    });

    if (!requests.length) {
      return res.status(404).json({ message: "No maintenance requests found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all maintenance requests
export const getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({})
      .select(
        "residentId residentName roomNumber issue priority status createdAt"
      )
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No maintenance requests found" });
    }

    const formattedRequests = requests.map((req) => ({
      requestId: req._id,
      residentId: req.residentId, // ✅ Include residentId here
      residentName: req.residentName,
      roomNumber: req.roomNumber,
      issue: req.issue,
      priority: req.priority,
      status: req.status,
      createdAt: req.createdAt,
    }));

    res.status(200).json({ maintenanceRequests: formattedRequests });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Admin : Assign Request
export const assignRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminName, status } = req.body;

    if (!adminName || !status) {
      return res
        .status(400)
        .json({ message: "Admin name and status are required." });
    }

    const request = await MaintenanceRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Maintenance request not found." });
    }

    // Update status and assignedBy
    request.status = status;
    request.assignedBy = adminName;

    await request.save();

    res.status(200).json({
      message: "Request assigned successfully",
      updatedRequest: {
        requestId: request._id,
        residentName: request.residentName,
        roomNumber: request.roomNumber,
        issue: request.issue,
        priority: request.priority,
        status: request.status,
        assignedBy: request.assignedBy,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    console.error("Error assigning request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Admin : Update Maintenance Request to Resident

export const updateMaintenanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminName, status, roomNumber } = req.body;

    if (!adminName || !status || !roomNumber) {
      return res.status(400).json({
        message: "adminName, status, and roomNumber are required",
      });
    }

    const request = await MaintenanceRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    // Only update specified fields
    request.assignedBy = adminName;
    request.status = status;
    request.roomNumber = roomNumber;

    await request.save();

    res.status(200).json({
      message: "Maintenance request updated successfully",
      updatedRequest: {
        requestId: request._id,
        residentName: request.residentName,
        roomNumber: request.roomNumber,
        status: request.status,
        assignedBy: request.assignedBy,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Admin : Delete Request

export const deleteRequest = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required." });
    }

    const request = await MaintenanceRequest.findOne({ roomNumber });

    if (!request) {
      return res
        .status(404)
        .json({ message: "Maintenance request not found for this room." });
    }

    await MaintenanceRequest.deleteOne({ roomNumber });

    res.status(200).json({
      message: "Maintenance request deleted successfully.",
      deletedRoom: roomNumber,
    });
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
