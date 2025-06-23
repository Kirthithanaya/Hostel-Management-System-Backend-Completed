import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import billingroutes from "./routes/billingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import financiaReportRoutes from "./routes/financialReportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/billing", billingroutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/resident", residentRoutes);
app.use("/api/financial", financiaReportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/integration", integrationRoutes);
app.use("/api/notifications", notificationRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port `, port);
});
