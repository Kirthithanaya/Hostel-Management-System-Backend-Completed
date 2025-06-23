import FinancialTransaction from "../models/FinancialReport.js";
import Room from "../models/Room.js";

// Helper function inside the controller
const calculateOccupancyRate = (occupied, total) => {
  if (total === 0) return 0;
  return ((occupied / total) * 100).toFixed(2);
};

// POST /api/financial-reports/transactions
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, date } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: "Type and amount are required." });
    }

    const newTransaction = new FinancialTransaction({
      type,
      amount,
      description,
      date: date || new Date(),
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Summary: revenue, expense, profit, occupancy rate
export const getFinancialSummary = async (req, res) => {
  try {
    const transactions = await FinancialTransaction.find();

    const revenue = transactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = revenue - expense;

    const rooms = await Room.find();
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.isOccupied).length;

    const occupancyRate = calculateOccupancyRate(occupiedRooms, totalRooms);

    res.status(200).json({
      revenue,
      expense,
      profit,
      occupancyRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Monthly breakdown for graphs
export const getMonthlyReport = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "revenue"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const monthlyData = await FinancialTransaction.aggregate(pipeline);

    res.status(200).json(monthlyData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Overview Report Controller
export const getOverviewReport = async (req, res) => {
  try {
    // Fetch financial data
    const transactions = await FinancialTransaction.find();

    const revenue = transactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = revenue - expense;
    const totalTransactions = transactions.length;

    // Fetch room data
    const rooms = await Room.find();
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.isOccupied).length;
    const occupancyRate = calculateOccupancyRate(occupiedRooms, totalRooms);

    // Monthly breakdown
    const monthlyPerformance = await FinancialTransaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "revenue"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Response
    res.status(200).json({
      summary: {
        totalRevenue: revenue,
        totalExpense: expense,
        profit,
        occupancyRate,
        totalRooms,
        occupiedRooms,
        totalTransactions,
      },
      monthlyPerformance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
