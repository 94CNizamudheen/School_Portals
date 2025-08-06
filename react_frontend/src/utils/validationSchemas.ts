import * as Yup from 'yup';
import { ageRules, calculateAge } from './helpers/calculateAge';



export const parentModalSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  occupation: Yup.string().notRequired(),
  relationship: Yup.string().required('Relationship is required'),
  emergencyContactName: Yup.string().required('Emergency Contact Name is required'),
  emergencyContactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Emergency Contact Phone must be 10 digits')
    .required('Emergency Contact Phone is required'),
  emergencyContactRelationship: Yup.string().required('Emergency Contact Relationship is required'),
});


export const teacherSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  address: Yup.string().required("Address is required"),
  dob: Yup.string().required("Date of birth is required"),
  university: Yup.string().required("University is required"),
  degree: Yup.string().required("Degree is required"),
  experienceYears: Yup.number()
    .typeError("Experience must be a number")
    .required("Experience is required")
    .positive("Must be positive")
    .integer("Must be a whole number"),

  subjects: Yup.array()
    .of(Yup.string().required("Subject is required"))
    .min(1, "At least one subject is required")
    .required("Subjects are required"),
  profileImage: Yup.mixed().required('select image'),
});


export const admissionValidationSchema = Yup.object({
  firstName: Yup.string().required('First name is required').trim(),
  lastName: Yup.string().required('Last name is required').trim(),
  address: Yup.string().required('Address is required').trim(),
  profilePicture: Yup.string()
    .required('Profile picture is required')
    .test(
      'is-valid-image',
      'Only .jpg, .jpeg, or .png formats are allowed',
      (value) => {
        if (!value) return false;
        return /\.(jpe?g|png)$/i.test(value);
      }
    ),
  bloodGroup: Yup.string().required('Blood group is required'),
  aadharDocument: Yup.string().required('Aadhar document is required'),
  birthCertificate: Yup.string().required('Birth certificate is required'),
  medicalInformation: Yup.string(),
  parentName: Yup.string().required('Parent name is required').trim(),
  relationToStudent: Yup.string().required('Relation to student is required').trim(),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  emergencyContactName: Yup.string().required('Emergency contact name is required'),
  emergencyContactNumber: Yup.string().matches(/^\d{10}$/, 'Emergency contact number must be 10 digits').required('Emergency contact number is required'),
  parentOccupation: Yup.string(),
  classApplied: Yup.string().required('Class applied is required'),
  nationality: Yup.string().required('Nationality required'),
  state: Yup.string().required("State is required"),
  pincode: Yup.string().required('Pincode required').matches(/^\d{6}$/, "Enter valid 6-digit pincode"),
  gender: Yup.string().required('please select gender'),
  religion: Yup.string().required('please select religion'),
  cast: Yup.string().required('please select cast'),
  previousSchool: Yup.string().when('classApplied', {
    is: (value: string) => value && value !== 'LKG',
    then: (schema) => schema.required('Previous school is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  transferCertificate: Yup.string().when('classApplied', {
    is: (value: string) => value && value !== 'LKG',
    then: (schema) => schema.required('Transfer certificate is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  dob: Yup.date()
    .required('Date of birth is required')
    .test('age-by-class', function (dobValue) {
      const { classApplied } = this.parent;
      if (!dobValue || !classApplied) return true;

      const age = calculateAge(dobValue);
      const rule = ageRules[classApplied];
      if (!rule) return false;

      if (age < rule.min || age > rule.max) {
        return this.createError({
          message: `Age for ${classApplied} must be between ${rule.min} and ${rule.max} years (current: ${age})`,
        });
      }

      return true;
    }),
});

export const signupSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const teacherValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  addressLine: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string().matches(/^\d{6}$/, "Pincode must be 6 digits").required("Pincode is required"),
  dob: Yup.date().max(new Date(), 'Date of birth cannot be in the future').required('Date of birth is required'),
  university: Yup.string().required('University is required'),
  qualification: Yup.string().required('Qualification is required'),
  subject: Yup.string().required('Subject is required'),
  teachingLevel: Yup.string().required('Teaching level is required'),
  experience: Yup.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high')
    .required('Experience is required'),
  KTET_CTET_certificateNo: Yup.string()
    .matches(/^(KTET|CTET)[A-Z0-9]{6,}$/, 'Invalid certificate number')
    .required('Certificate number is required')
});

export const getLoginValidationSchema = (role: string) =>
  Yup.object().shape({
    identifier: role === "STUDENT"
      ? Yup.string().required("Student ID is required")
      : Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

export const step1Schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  identity: Yup.string().required('Required'),
});

export const passwordSchema = Yup.object({
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});