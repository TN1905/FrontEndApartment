import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { to, subject, message, link } = req.body;

        // Cấu hình transporter cho Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hoangnguyen77889966@gmail.com", // Địa chỉ email của bạn
                pass: "rzia usoj tkjr wbab", // Mật khẩu ứng dụng được tạo từ Google
            },
        });

        // Cấu hình nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: `<p>${message}</p><a href="${link}">Gia hạn hợp đồng</a>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error sending email:", error.message, error.stack);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
