

export const studentLoginTemplate = (studentIdentity: string, password: string): string => `
  <div style="font-family: Arial, sans-serif; font-size: 14px;">
    <p>Dear Parent,</p>

    <p>Your child has been successfully admitted. Below are the student login credentials:</p>

    <ul>
      <li><strong>Student ID:</strong> ${studentIdentity}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>

    <p>Please use these credentials to log in to the student portal.</p>
    <p>We recommend changing the password upon first login.</p>

    <br />
    <p>Regards,<br/>School Administration</p>
  </div>
`;
