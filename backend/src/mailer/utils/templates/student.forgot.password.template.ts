export const studentForgotTemplate = (identity: string, name: string, password: string):string => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
        <tr>
          <td style="padding: 30px; text-align: center; background: linear-gradient(90deg, #3b82f6, #9333ea); color: white;">
            <h1 style="margin: 0; font-size: 24px;">Student Password Recovery</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; color: #111827;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Dear Parent,
            </p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your child <strong>${name}</strong> has requested their password for school access. Please find their login information below:
            </p>

            <p style="font-size: 16px; margin-bottom: 10px;">
              <strong>Student Identity:</strong> ${identity}<br/>
              <strong>Password:</strong> <span style="color:#2563eb;">${password}</span>
            </p>

            <p style="font-size: 16px; margin-top: 30px;">
              If you did not authorize this request, please contact the school administration immediately.
            </p>

            <p style="font-size: 14px; color: #6b7280; margin-top: 40px;">
              — School Administration Team
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f3f4f6;">
            © ${new Date().getFullYear()} Your School. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `;
};
