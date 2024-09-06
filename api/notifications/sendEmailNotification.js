export const sendEmailNotification = async ({ to, subject, message, link }) => {
    try {
        const response = await fetch("/api/send_email/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to,
                subject,
                message,
                link,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
