import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { sendEmail } from "./sendEmail.utils";

export const generate6DigitOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const sendResetPasswordOtp = async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) return;

    const now = new Date();
    if (user.resetPasswordOtpLastSentAt) {
        const diff = now.getTime() - user.resetPasswordOtpLastSentAt.getTime();
        if (diff < 60_000) return;
    }

    const otp = generate6DigitOtp();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordOtpHash = otpHash;
    user.resetPasswordOtpExpiresAt = new Date(Date.now() + 60 * 1000);
    user.resetPasswordOtpVerifyAttempts = 0;
    user.resetPasswordOtpLastSentAt = now;

    await user.save();

    await sendEmail(
        email,
        "[Listing App] Password Reset",
        `Your password reset code is: ${otp}\n\nThis code expires in 10 Seconds.`
    );
};
