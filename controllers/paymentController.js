import Stripe from "stripe";
import Invoice from "../models/Billing.js";
import Payment from "../models/Payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//resident : Process pAyment
export const processPayment = async (req, res) => {
  try {
    const { invoiceId, paymentMethod } = req.body;
    const residentId = req.user.id;
    const residentName = req.user.name;

    // Validate input
    if (!invoiceId || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Invoice ID and payment method are required." });
    }

    // Find the invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    if (invoice.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Invoice is already paid." });
    }

    let paymentIntentId = null;

    // If payment method is Stripe
    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(invoice.totalAmount * 100), // in paise
        currency: "inr",
        payment_method_types: ["card"],
        metadata: {
          residentName,
          invoiceId: invoice._id.toString(),
        },
      });

      paymentIntentId = paymentIntent.id;

      // Optionally, confirm the payment intent client-side
    }

    // Record payment
    const payment = new Payment({
      residentId,
      residentName,
      invoiceId,
      amountPaid: invoice.totalAmount,
      paymentMethod,
      paidAt: new Date(),
    });

    await payment.save();

    // Update invoice status
    invoice.paymentStatus = "Paid";
    await invoice.save();

    res.status(200).json({
      message: "Payment processed successfully.",
      payment,
      stripeClientSecret: paymentIntentId ? paymentIntentId : undefined,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Resident :Get Payment History

export const getPaymentHistory = async (req, res) => {
  try {
    const residentId = req.user.id; // From auth middleware

    const payments = await Payment.find({ residentId }).sort({ date: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error getting payment history:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
