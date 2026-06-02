const { Resend } = require("resend");

console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const result = await resend.emails.send({
            from: "Eventora <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

        if (result.error) {
            console.error("Email sending failed:", result.error);
            return;
        }

        console.log("Email sent successfully:", result.data.id);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = {
    sendEmail,
};