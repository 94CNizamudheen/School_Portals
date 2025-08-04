
export  const rejectTeacherTemplate =(name:string)=> `
      <p>Dear ${name},</p>
      <p>We regret to inform you that your <strong>teacher application</strong> has been <span style="color:red;">rejected</span>.</p>
      <p>If you have any questions, feel free to contact us.</p>
      <br/>
      <p>Regards,<br/>School Admin</p>
    `;