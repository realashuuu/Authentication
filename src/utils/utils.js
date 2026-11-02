export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>

  <body style="margin: 0; padding: 30px 15px; background-color: #f4f4f4; font-family: Arial, sans-serif;">

    <div style="max-width: 450px; margin: auto; padding: 35px 25px; background-color: #ffffff; border-radius: 10px; text-align: center;">

      <h2 style="color: #222; margin-bottom: 15px;">
        Verify Your Account
      </h2>

      <p style="font-size: 15px; color: #666; line-height: 1.6;">
        Use the verification code below to complete your registration.
      </p>

      <div style="margin: 30px 0; padding: 18px; background-color: #f4f7fb; border-radius: 8px;">
        <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb; margin: 0;">
          ${otp}
        </h1>
      </div>

      <p style="font-size: 14px; color: #777; line-height: 1.6;">
        This OTP is valid for a limited time. Please do not share it with anyone.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

      <p style="font-size: 12px; color: #999;">
        If you did not request this verification code, please ignore this email.
      </p>

    </div>

  </body>
  </html>
  `;
}
