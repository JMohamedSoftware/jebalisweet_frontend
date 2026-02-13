const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function testEmail() {
    console.log('--- Test de configuration Email ---');
    console.log('Hôte:', process.env.EMAIL_HOST);
    console.log('Port:', process.env.EMAIL_PORT);
    console.log('Utilisateur:', process.env.EMAIL_USER);
    console.log('Expéditeur (From):', process.env.EMAIL_FROM);
    console.log('-----------------------------------');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('1. Vérification de la connexion SMTP...');
        await transporter.verify();
        console.log('✅ Connexion SMTP réussie !');

        console.log('2. Tentative d\'envoi d\'email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM, // Send to self for testing
            subject: 'Test Email - Jebali Sweet',
            text: 'Si vous recevez ceci, la configuration SendGrid fonctionne !',
            html: '<h1>Test Réussi !</h1><p>Le système d\'envoi d\'email fonctionne.</p>'
        });

        console.log('✅ Email envoyé avec succès !');
        console.log('Message ID:', info.messageId);
        console.log('Réponse SMTP:', info.response);

    } catch (error) {
        console.error('❌ ECHEC du test :');
        console.error('Erreur:', error.message);
        if (error.response) {
            console.error('Réponse détaillée:', error.response);
        }
        if (error.code === 'EAUTH') {
            console.error('👉 Vérifiez votre clé API SendGrid (EMAIL_PASS) et l\'utilisateur (apikey).');
        }
        if (error.responseCode === 550) {
            console.error('👉 L\'adresse EMAIL_FROM n\'est peut-être pas vérifiée dans SendGrid/Sender Authentication.');
        }
    }
}

testEmail();
