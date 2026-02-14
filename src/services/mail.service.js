import nodemailer from "nodemailer";

export default class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  sendResetEmail = async (to, token) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Hacé click en el siguiente botón:</p>
        <a href="${resetLink}">
          <button>Restablecer contraseña</button>
        </a>
        <p>Este enlace expira en 1 hora.</p>
      `,
    });
  };
}
