import nodemailer from "nodemailer";

// Transporter configuration
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kennycix02@gmail.com",
    pass: "ovqu uzjg ffgc omjx", // App Password
  },
});

// Verify connection
transporter.verify()
  .then(() => console.log("Ready to send emails"))
  .catch((error) => console.error("Email config error:", error));

// --- WELCOME EMAIL ---
export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: '"UCEats Support" <kennycix02@gmail.com>',
      to: email,
      subject: "Welcome to UCEats",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #d32f2f;">UCEats</h1>
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for joining. You can now order food directly from the app.</p>
          <br>
          <a href="http://localhost:5173" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to App</a>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

// --- PAYMENT RECEIPT EMAIL ---
export const sendPaymentReceipt = async (email, name, orderId, total) => {
  try {
    await transporter.sendMail({
      from: '"UCEats Payments" <kennycix02@gmail.com>',
      to: email,
      subject: `Order Receipt #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #2e7d32;">Payment Successful</h1>
          <p>Hello ${name}, your order has been confirmed.</p>
          <div style="background-color: #f1f8e9; padding: 15px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Paid:</strong> $${total}</p>
          </div>
          <p>Your food is being prepared.</p>
        </div>
      `,
    });
    console.log(`Receipt sent to ${email}`);
  } catch (error) {
    console.error("Error sending receipt:", error);
  }
};