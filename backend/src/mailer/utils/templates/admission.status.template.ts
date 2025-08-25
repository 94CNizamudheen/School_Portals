
export function admissionStatusTemplate(status: string): string {
  switch (status) {
    case 'approved':
      return `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2e7d32;">🎉 Application Approved</h2>
          <p>Dear Applicant,</p>
          <p>Congratulations! Your admission application has been <strong>approved</strong>.</p>
          <p>Please complete your payment to proceed with the final admission process.</p>
          <p style="margin-top: 20px;">Best regards,<br/>Admissions Office</p>
        </div>
      `;

    case 'rejected':
      return `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #c62828;">⚠️ Application Rejected</h2>
          <p>Dear Applicant,</p>
          <p>We regret to inform you that your admission application has been <strong>rejected</strong> due to invalid or incomplete data.</p>
          <p>Please review your information and try again.</p>
          <p style="margin-top: 20px;">Best regards,<br/>Admissions Office</p>
        </div>
      `;

    default:
      return `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>📌 Application Status Update</h2>
          <p>Dear Applicant,</p>
          <p>Your admission status has been updated: <strong>${status}</strong>.</p>
          <p>Please contact the admissions office for more details.</p>
          <p style="margin-top: 20px;">Best regards,<br/>Admissions Office</p>
        </div>
      `;
  }
}
