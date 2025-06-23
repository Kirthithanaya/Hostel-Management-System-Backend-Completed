import { sendEmail } from "../services/emailService.js";
import { sendSMS } from "../services/smsService.js";
import { backupDatabase } from "../services/backupService.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const emailNotify = async (req, res) => {
  const { to, subject, text } = req.body;
  await sendEmail(to, subject, text);
  res.json({ message: "Email sent successfully" });
};

export const smsNotify = async (req, res) => {
  const { to, message } = req.body;
  await sendSMS(to, message);
  res.json({ message: "SMS sent successfully" });
};

// Handle Payment

export const handlePayment = async (req, res) => {
  try {
    const { amountPaid, token } = req.body;

    if (!amountPaid || !token) {
      return res.status(400).json({ message: "Amount and token are required" });
    }

    // Create a charge using the test token (e.g., tok_visa)
    const charge = await stripe.charges.create({
      amount: Math.round(amountPaid * 100), // amount in paise
      currency: "inr",
      source: token, // e.g., tok_visa
      description: "Hostel payment",
    });

    // Simulated database record (save to Payment collection in real use)
    const payment = {
      amountPaid,
      method: "Stripe",
      stripeId: charge.id,
      status: charge.status,
      paidAt: new Date(),
    };

    res.status(200).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment Error:", error.message);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};

export const triggerBackup = (req, res) => {
  backupDatabase();
  res.json({ message: "Backup started" });
};
