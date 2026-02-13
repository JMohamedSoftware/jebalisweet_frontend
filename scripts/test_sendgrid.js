const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

// Try loading from multiple locations
const envPaths = [
    path.join(__dirname, '../backend/.env'),
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../.env.local')
];

envPaths.forEach(p => {
    const result = dotenv.config({ path: p });
    if (result.error) {
        console.log(`Failed to load: ${p}`);
    } else {
        console.log(`Loaded: ${p}`);
    }
});

console.log('--- SendGrid Test ---');
console.log(`Host: ${process.env.EMAIL_HOST}`);
console.log(`Port: ${process.env.EMAIL_PORT}`);
console.log(`User: ${process.env.EMAIL_USER}`);
// Showing first 5 chars of key for verification
const pass = process.env.EMAIL_PASS || '';
console.log(`Key: ${pass.substring(0, 5)}...`);
console.log(`From: ${process.env.EMAIL_FROM}`);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'apikey',
        pass: process.env.EMAIL_PASS,
    },
});

async function test() {
    try {
        console.log('\nVerifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified!');

        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: `"Jebali Sweet Test" <${process.env.EMAIL_FROM}>`,
            to: 'jbelimohamed.software@gmail.com', // Sending to self/admin for test
            subject: 'Test Email - Jebali Sweet Debug',
            text: 'This is a test email to verify SendGrid configuration.',
            html: '<b>This is a test email</b> to verify SendGrid configuration.',
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
    }
}

test();
