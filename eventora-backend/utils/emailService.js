const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        await sgMail.send({
            to,
            from: "rahafrsq719@hotmail.com",
            subject,
            html,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending failed:", error.response?.body || error);
    }
};

module.exports = {
    sendEmail,
};