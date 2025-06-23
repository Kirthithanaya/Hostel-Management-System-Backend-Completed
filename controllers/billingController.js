import Billing from "../models/Billing.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Ensure your key is in .env

export const generateInvoice = async (req, res) => {
  try {
    const {
      residentName,
      roomNumber,
      roomFee,
      utilities,
      services,
      discount = 0,
      lateFee = 0,
      paymentMethod,
      dueDate,
      generatedBy,
    } = req.body;

    // Validate required fields
    if (
      !residentName ||
      !roomNumber ||
      roomFee == null ||
      utilities == null ||
      services == null ||
      !paymentMethod
    ) {
      return res
        .status(400)
        .json({ message: "Missing required billing fields." });
    }

    // Calculate total
    const subtotal = roomFee + utilities + services + lateFee;
    const totalAmount = subtotal - discount;

    let stripePaymentIntentId = null;

    // If Stripe is selected, create payment intent
    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
        currency: "inr",
        payment_method_types: ["card"], // use ["card"] or enable others in dashboard
        metadata: {
          residentName,
          roomNumber,
        },
      });

      stripePaymentIntentId = paymentIntent.id;
    }

    // Create billing record
    const invoice = new Billing({
      residentName,
      roomNumber,
      roomFee,
      utilities,
      services,
      discount,
      lateFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Paid" : "Pending",
      stripePaymentIntentId,
      dueDate,
      generatedBy,
    });

    await invoice.save();

    res.status(201).json({
      message: "Invoice generated successfully.",
      invoice,
      ...(stripePaymentIntentId && {
        stripeClientSecret: stripePaymentIntentId,
      }),
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Admin : Get Invoices

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Billing.find().sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      message: "Invoices fetched successfully.",
      invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// resident : Get My Invoices
export const getMyInvoices = async (req, res) => {
  try {
    const residentName = req.user.name; // assuming 'name' is in token payload

    const invoices = await Billing.find({ residentName }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Resident invoices fetched successfully.",
      invoices,
    });
  } catch (error) {
    console.error("Error fetching resident invoices:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//Admin :DeleteInvoice(Only Admin)

export const deleteInvoices = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    if (!roomNumber) {
      return res
        .status(400)
        .json({ message: "roomNumber is required in request body." });
    }

    const deletedBilling = await Billing.findOneAndDelete({ roomNumber });

    if (!deletedBilling) {
      return res
        .status(404)
        .json({ message: "Billing record not found for this room number" });
    }

    return res.status(200).json({
      message: `Billing record for room ${roomNumber} deleted successfully.`,
      deletedBilling,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
