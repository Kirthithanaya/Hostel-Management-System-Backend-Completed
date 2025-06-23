import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.PASS_MAIL,
      pass: process.env.PASS_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.PASS_MAIL,
    to,
    subject,
    text,
  });
};

export default sendEmail;
