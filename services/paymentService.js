import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (amountPaid, token) => {
  const charge = await stripe.charges.create({
    amountPaid,
    currency: "usd",
    source: token,
    description: "Hostel Payment",
  });

  return charge;
};
