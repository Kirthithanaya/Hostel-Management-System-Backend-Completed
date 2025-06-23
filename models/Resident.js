import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    roomNumber: { type: String, required: true },
    checkInDate: { type: Date, default: Date.now },
    checkOutDate: { type: Date },
    isCheckedOut: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Resident = mongoose.model("Resident", residentSchema);
export default Resident;
