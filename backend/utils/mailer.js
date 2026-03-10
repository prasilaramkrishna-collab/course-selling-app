import nodemailer from 'nodemailer';

let cachedTransporter = null;

const requiredEnv = ['EMAIL_USER', 'EMAIL_PASSWORD'];

export const getEmailConfigStatus = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);
    return {
        isConfigured: missing.length === 0,
        missing,
    };
};

const createTransporter = () => {
    if (cachedTransporter) {
        return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    return cachedTransporter;
};

export const sendUserEmail = async ({ to, subject, html, attachments = [] }) => {
    const status = getEmailConfigStatus();
    if (!status.isConfigured) {
        const details = `Missing env: ${status.missing.join(', ')}`;
        console.warn(`[Email Disabled] ${details}`);
        return {
            success: false,
            skipped: true,
            reason: details,
        };
    }

    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html,
            attachments,
        });

        return {
            success: true,
            skipped: false,
            messageId: info.messageId,
            response: info.response,
        };
    } catch (error) {
        console.error('[Email Error]', error?.message || error);
        return {
            success: false,
            skipped: false,
            reason: error?.message || 'Unknown email error',
        };
    }
};
