
export interface Teacher {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dob: string;
    qualification: string;
    university: string;
    experience: string;
    KTET_CTET_certificateNo: string;
    subject: string;
    eligibilityDocuments: string[];
    profileImage?: string;
    status: string;
}