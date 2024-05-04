const nodemailer = require("nodemailer");
exports.sendEmail = async (email, token) => {
  let message = `Your forget password like is ${process.env.FRONT_END_URL}/consent/preview/${token}`;
  // console.log("link ", message);

  try {
    let transporter = nodemailer.createTransport({
      host: "mail.thebeyond.tech",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.NODE_EMAILER_EMAIL,
        pass: process.env.NODE_EMAILER_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.NODE_EMAILER_EMAIL,
      to: email,
      subject: "Global Consulting Ltd.",
      html: message,
    });
  } catch (error) {
    console.log(error);
  }
};
