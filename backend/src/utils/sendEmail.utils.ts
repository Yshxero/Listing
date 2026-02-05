import dotenv from "dotenv";
dotenv.config();
import nodemailer, { Transporter } from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: `"Listing App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
};

{/*let transporter: Transporter | null = null;

const getTransporter = async () => {
    if (transporter) return transporter;

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log("📧 Ethereal account created:");
    console.log("  user:", testAccount.user);

    return transporter;
};

export const sendEmail = async (to: string, subject: string, text: string) => {
    const t = await getTransporter();

    const info = await t.sendMail({
        from: `"Listing App (Dev)" <no-reply@listing.dev>`,
        to,
        subject,
        text,
    });

    const preview = nodemailer.getTestMessageUrl(info);
    console.log("✅ Email sent");
    console.log("🔗 Preview URL:", preview);
};
*/}
