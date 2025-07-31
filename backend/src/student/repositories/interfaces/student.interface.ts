
interface StudentInterface {
    _id: string;
    firstName: string;
    lastName: string;
    identity: string;
    password: string;
    classLevel: string;
    admissionId: string;
    parentIds: string[];
    isActive: boolean;

    rollNumber?: string;
    grade?: string;
    class?: string;

    dateOfBirth?: string; 
    gender?: string;
    bloodGroup?: string;
    nationality?: string;

    address?: string;
    city?: string;
    state?: string;
    pincode?: string;

    mobileNumber?: string;
    email?: string;

    previousSchool?: string;
    enrollmentDate?: string; 
    profileImage?: string;

    medicalInformation?: string;

    createdAt?: string;
    updatedAt?: string;


}