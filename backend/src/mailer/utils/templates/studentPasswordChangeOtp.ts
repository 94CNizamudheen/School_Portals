export const studentOtpTemplate = (studentName: string, otp: string):string => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #4f46e5;">Password Reset Request</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>We received a request to reset your password. Use the OTP below to proceed with the password change:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 6px;">
          ${otp}
        </span>
      </div>

      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <p>If you did not request a password change, you can safely ignore this email.</p>

      <hr style="margin: 30px 0;" />
      <p style="font-size: 14px; color: #888888;">Thanks,<br />The School Management Team</p>
    </div>
  </div>
`;
