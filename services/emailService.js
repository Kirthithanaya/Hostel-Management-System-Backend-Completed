import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Pass_MAIL,
      pass: process.env.PASS_KEY,
    },
  });

  await transporter.sendMail({
    from: `"Hostel System" <${process.env.Pass_MAIL}>`,
    to,
    subject,
    text,
  });
};
