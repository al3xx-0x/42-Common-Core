const nodemailer = require('nodemailer');
const { getEnvFromVault } = require('../utils/vault');

const sendEmail = async (options) => {
    try {
        const envVars = await getEnvFromVault();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: envVars.SMTP_CLIENT,
                pass: envVars.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: envVars.SMTP_CLIENT,
            to: options.email,
            subject: options.subject,
            text: options.text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

module.exports = sendEmail;