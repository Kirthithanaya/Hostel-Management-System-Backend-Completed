import Notification from "../models/Notification.js";
import { sendEmail } from "./emailService.js";
import { sendSMS } from "./smsService.js";

export const createNotification = async ({
  recipientName,
  type,
  message,
  email,
  phone,
  subject,
}) => {
  if (type === "email" && email) {
    await sendEmail(email, subject || "Hostel Notification", message);
  } else if (type === "sms" && phone) {
    await sendSMS(phone, message);
  }

  const notification = new Notification({
    recipientName,
    type,
    message,
  });

  await notification.save();
  return notification;
};
