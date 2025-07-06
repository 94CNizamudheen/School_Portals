import type { AdmissionFormData } from "../student.controller"

export function generateAdmissionSummary(admissionData: AdmissionFormData, verificationOtp: string): string {
  const { student, parent } = admissionData

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Admission Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                                🎓 Student Admission Application
                            </h1>
                            <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px;">
                                Application Preview & Verification
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            
                            <!-- Introduction -->
                            <div style="margin-bottom: 30px; padding: 20px; background-color: #f8f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
                                <p style="margin: 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                    Please review the following details carefully and use the verification code below to confirm your application.
                                </p>
                            </div>
                            
                            <!-- Student Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">
                                    👤 Student Information
                                </h2>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Name:</strong>
                                            <span style="color: #2d3748;">${student.firstName} ${student.lastName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Email:</strong>
                                            <span style="color: #2d3748;">${student.email}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Phone:</strong>
                                            <span style="color: #2d3748;">${student.mobileNumber}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Date of Birth:</strong>
                                            <span style="color: #2d3748;">${student.dateOfBirth || "Not provided"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Gender:</strong>
                                            <span style="color: #2d3748;">${student.gender || "Not provided"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Grade:</strong>
                                            <span style="color: #2d3748;">${student.grade || "Not provided"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Class:</strong>
                                            <span style="color: #2d3748;">${student.class || "Not provided"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Roll Number:</strong>
                                            <span style="color: #2d3748;">${student.rollNumber || "Not provided"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px; vertical-align: top;">Address:</strong>
                                            <span style="color: #2d3748;">
                                                ${
                                                  [student.address, student.city, student.state, student.pincode]
                                                    .filter(Boolean)
                                                    .join(", ") || "Not provided"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Parent Information -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">
                                    👨‍👩‍👧‍👦 Parent Information
                                </h2>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Name:</strong>
                                            <span style="color: #2d3748;">${parent.name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Email:</strong>
                                            <span style="color: #2d3748;">${parent.email}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Phone:</strong>
                                            <span style="color: #2d3748;">${parent.mobileNumber}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <strong style="color: #4a5568; display: inline-block; width: 140px;">Relationship:</strong>
                                            <span style="color: #2d3748;">${parent.relationship || "Not provided"}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Verification Section -->
                            <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                                <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">
                                    🔐 Verification Required
                                </h3>
                                <p style="color: #e6fffa; margin: 0 0 15px 0; font-size: 14px;">
                                    Share this OTP with the admin for verification:
                                </p>
                                <div style="background-color: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0;">
                                    <span style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                                        ${verificationOtp}
                                    </span>
                                </div>
                                <p style="color: #e6fffa; margin: 0; font-size: 12px;">
                                    ⏰ This verification code will expire in 10 minutes
                                </p>
                            </div>
                            
                            <!-- Important Notice -->
                            <div style="background-color: #fef5e7; border: 1px solid #f6ad55; border-radius: 6px; padding: 15px; margin-top: 20px;">
                                <p style="margin: 0; color: #744210; font-size: 14px; line-height: 1.5;">
                                    <strong>⚠️ Important:</strong> Please keep this information secure and only share the verification code with authorized school administrators.
                                </p>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #718096; font-size: 12px; line-height: 1.5;">
                                This is an automated message from the Student Admission System.<br>
                                Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `
}
