require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route to Send Invitation Email
app.post("/send-invite", async (req, res) => {
    console.log("Incoming request:", req.method, req.url);

    const { email, eventName, organizer } = req.body;

    if (!email || !eventName || !organizer) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `You're invited to ${eventName}!`,
            text: `Hello, you have been invited to ${eventName} by ${organizer}. Please confirm your participation.`,
        });

        res.json({ success: "Invitation email sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
