import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailfrom.dev",
      port: 25,
      auth: {
        user: process.env.MAILFROM_USERNAME,
        pass: process.env.MAILFROM_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"BGC Bus Tracking System" <bgcbts@mail.com>`, // can be any email
      to,
      subject,
      text,
      html: `<b>Hey!</b> ${text}`,
    });
    return info;
  } catch (err) {
    throw err;
  }
}

