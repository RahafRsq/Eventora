const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = await resend.emails.send({
            from: "Eventora <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

        console.log("Email sent successfully:", data.id);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = {
    sendEmail,
};