import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escapeHTML(str: string) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            default: return m;
        }
    });
}

export async function POST(request: Request) {
    try {
        const { name, email, message, type } = await request.json();

        // Validation
        if (!email || !message) {
            return NextResponse.json(
                { message: 'Veuillez remplir les champs obligatoires.' },
                { status: 400 }
            );
        }

        // Déterminer le destinataire selon le type
        const recipient = type === 'support'
            ? 'MohamedJbeli@jebalisweet.tn'
            : 'AidaJebali@jebalisweet.tn';

        const subject = type === 'support'
            ? `Support Technique: Nouveau message de ${name || email}`
            : `Demande de Contact: Nouveau message de ${name || email}`;

        // Configurer Nodemailer
        // SECURITY: Never hardcode credentials in source code. Fallbacks removed.
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Sanitize user inputs for HTML context
        const safeName = escapeHTML(name || 'Non spécifié');
        const safeMessage = escapeHTML(message);

        const mailOptions = {
            from: `"${safeName}" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: recipient,
            subject: subject,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #8B6F47;">Nouveau message depuis le site web</h2>
          <p><strong>De :</strong> ${safeName} (${escapeHTML(email)})</p>
          <hr />
          <h3>Message :</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${safeMessage}</p>
          <hr />
          <br/>
          <p style="font-size: 12px; color: #888;">Ce message a été envoyé depuis le formulaire de contact du site Jebali Sweet.</p>
        </div>
      `,
        };

        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'E-mail envoyé avec succès !' }, { status: 200 });

    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'envoi." },
            { status: 500 }
        );
    }
}
