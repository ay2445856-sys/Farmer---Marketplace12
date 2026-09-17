const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const PORT = process.env.PORT || 3000;

const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

if (!MSG91_AUTHKEY || !MSG91_TEMPLATE_ID) {
    console.log("MSG91 credentials missing in .env");
}

function cleanMobile(mobile) {
    let number = String(mobile).replace(/\D/g, "");

    if (number.startsWith("91") && number.length === 12) {
        return number;
    }

    if (number.length === 10) {
        return "91" + number;
    }

    return null;
}

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Farmer Marketplace OTP server is running"
    });
});

app.post("/api/send-otp", async (req, res) => {
    try {
        const { mobile } = req.body;

        const phone = cleanMobile(mobile);

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10 digit Indian mobile number"
            });
        }

        const url = "https://control.msg91.com/api/v5/otp";

        const response = await axios.post(
            url,
            {
                mobile: phone,
                template_id: MSG91_TEMPLATE_ID,
                otp_length: 6,
                otp_expiry: 5
            },
            {
                headers: {
                    authkey: MSG91_AUTHKEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("MSG91 SEND OTP:", response.data);

        if (
            response.data.type === "success" ||
            response.data.message
        ) {
            return res.json({
                success: true,
                message: "OTP sent successfully",
                requestId: response.data.request_id || null
            });
        }

        return res.status(400).json({
            success: false,
            message: response.data.message || "OTP could not be sent"
        });

    } catch (error) {
        console.error(
            "SEND OTP ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                "MSG91 OTP service error"
        });
    }
});

app.post("/api/verify-otp", async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const phone = cleanMobile(mobile);

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number"
            });
        }

        if (!otp || !/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 6 digit OTP"
            });
        }

        const response = await axios.get(
            "https://control.msg91.com/api/v5/otp/verify",
            {
                params: {
                    otp: otp,
                    mobile: phone
                },
                headers: {
                    authkey: MSG91_AUTHKEY
                }
            }
        );

        console.log("MSG91 VERIFY OTP:", response.data);

        const message = String(
            response.data.message || ""
        ).toLowerCase();

        if (
            response.data.type === "success" ||
            message.includes("success") ||
            message.includes("verified")
        ) {
            return res.json({
                success: true,
                message: "OTP verified successfully",
                mobile: phone
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP"
        });

    } catch (error) {
        console.error(
            "VERIFY OTP ERROR:",
            error.response?.data || error.message
        );

        return res.status(400).json({
            success: false,
            message:
                error.response?.data?.message ||
                "Invalid or expired OTP"
        });
    }
});

app.post("/api/resend-otp", async (req, res) => {
    try {
        const { mobile } = req.body;

        const phone = cleanMobile(mobile);

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number"
            });
        }

        const response = await axios.get(
            "https://control.msg91.com/api/v5/otp/retry",
            {
                params: {
                    mobile: phone,
                    retrytype: "text"
                },
                headers: {
                    authkey: MSG91_AUTHKEY
                }
            }
        );

        console.log("MSG91 RESEND OTP:", response.data);

        if (
            response.data.type === "success" ||
            response.data.message
        ) {
            return res.json({
                success: true,
                message: "OTP resent successfully"
            });
        }

        return res.status(400).json({
            success: false,
            message: response.data.message || "OTP resend failed"
        });

    } catch (error) {
        console.error(
            "RESEND OTP ERROR:",
            error.response?.data || error.message
        );

        return res.status(400).json({
            success: false,
            message:
                error.response?.data?.message ||
                "OTP resend failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
