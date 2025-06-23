import Room from "../models/Room.js";

// Admin Create Room
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity } = req.body;

    // Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const room = new Room({
      roomNumber,
      type,
      capacity,
      // occupants and status will use default values from the schema
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Admin: Get All Room

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Resident : Get All Rooms

export const residentGetAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    const simplifiedRooms = rooms.map((room) => ({
      _id: room._id,
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      currentOccupancy: room.currentOccupancy,
      status: room.status,
      createdAt: room.createdAt,
    }));

    res.status(200).json(simplifiedRooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error });
  }
};

//Resident : CheckIn Room

export const checkInRoom = async (req, res) => {
  const { roomNumber, residentName } = req.body;

  try {
    if (!roomNumber || !residentName) {
      return res
        .status(400)
        .json({ message: "roomNumber and residentName are required." });
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: "Room is full." });
    }

    const alreadyCheckedIn = room.residents.some(
      (r) => r.residentName === residentName && r.checkOutDate === null
    );
    if (alreadyCheckedIn) {
      return res
        .status(400)
        .json({ message: "Resident is already checked in." });
    }

    room.residents.push({
      residentName,
      checkInDate: new Date(),
      checkOutDate: null,
    });

    room.currentOccupancy += 1;
    if (room.currentOccupancy >= room.capacity) {
      room.status = "Occupied";
    }

    await room.save();

    res.status(200).json({ message: "Check-in successful.", room });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Admin : GetCheckIn Rooms
export const getAllRoomCheckIns = async (req, res) => {
  try {
    const rooms = await Room.find({ currentOccupancy: { $gt: 0 } }).sort({
      createdAt: -1,
    });

    const roomData = rooms.map((room) => ({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      currentOccupancy: room.currentOccupancy,
      residents: room.residents.map((resident) => ({
        residentName: resident.residentName,
        checkInDate: resident.checkInDate,
        checkOutDate: resident.checkOutDate,
      })),
    }));

    res.status(200).json(roomData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Admin: Assign Room Forresident

export const assignRoom = async (req, res) => {
  const { residentName, roomNumber } = req.body;

  if (!residentName || !roomNumber) {
    return res
      .status(400)
      .json({ message: "Resident name and room number are required." });
  }

  try {
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: "Room is already full." });
    }

    // Add resident to room
    room.residents.push({
      residentName,
      checkInDate: new Date(),
      checkOutDate: null,
    });

    room.currentOccupancy += 1;
    room.status =
      room.currentOccupancy === room.capacity ? "Occupied" : "Available";

    await room.save();

    res.status(200).json({ message: "Room assigned successfully", room });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning room", error: error.message });
  }
};

//Resident : Checkout Room

export const checkOutRoom = async (req, res) => {
  try {
    const { residentName, roomNumber } = req.body;

    if (!residentName || !roomNumber) {
      return res
        .status(400)
        .json({ message: "residentName and roomNumber are required." });
    }

    // Find the room with the specified roomNumber and residentName
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    const resident = room.residents.find(
      (r) => r.residentName === residentName && !r.checkOutDate
    );

    if (!resident) {
      return res
        .status(404)
        .json({ message: "Active resident not found in this room." });
    }

    // Set checkOutDate and update current occupancy
    resident.checkOutDate = new Date();
    room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);

    // Update room status if empty
    if (room.currentOccupancy === 0) {
      room.status = "Available";
    }

    await room.save();

    res.status(200).json({ message: "Check-out successful." });
  } catch (error) {
    res.status(500).json({ message: "Check-out failed", error: error.message });
  }
};

///admin : Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required." });
    }

    const deletedRoom = await Room.findOneAndDelete({ roomNumber });

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found." });
    }

    res
      .status(200)
      .json({ message: `Room ${roomNumber} deleted successfully.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete room.", error: error.message });
  }
};
