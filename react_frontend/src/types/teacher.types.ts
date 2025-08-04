
export interface Teacher {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dob: string;
    address:{
        addressLine:string
        city:string
        state:string
        pincode:string
    }
    qualification: string;
    university: string;
    experience: string;
    KTET_CTET_certificateNo: string;
    subject: string;
    eligibilityDocuments: string[];
    profileImage?: string;
    status: string;
}