export const userOtpTemplate = (userName: string, code: string):string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 30px;
        color: #333333;
      }
      h1 {
        color: #5a2d82;
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      .otp-code {
        font-size: 32px;
        font-weight: bold;
        color: #5a2d82;
        letter-spacing: 4px;
        margin: 20px 0;
        text-align: center;
        background-color: #f0e6fa;
        padding: 15px;
        border-radius: 6px;
        user-select: all;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #999999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello ${userName},</h1>
      <p>We received a request to reset your password. Use the OTP code below to proceed:</p>
      <div class="otp-code">${code}</div>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br/>Your Company Team</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  </body>
  </html>
`;
