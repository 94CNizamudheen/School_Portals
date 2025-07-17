import * as Yup from 'yup';

export const personalInformationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('First Name is required'),
  lastName: Yup.string()
    .trim()
    .required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  dateOfBirth: Yup.date()
    .required('Date of Birth is required')
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 4)),
      'Student must be at least 4 years old'
    ),
  gender: Yup.string().required('Gender is required'),
  bloodGroup: Yup.string().notRequired(),
  nationality: Yup.string().notRequired(),
  profileImage: Yup.mixed().required('select image'),
});

export const academicInformationSchema = Yup.object().shape({
  grade: Yup.string().required('Grade is required'),
  class: Yup.string().required('Class is required'),
  rollNumber: Yup.number().required('Roll Number is required'),
  previousSchool: Yup.string().notRequired(),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
});

export const parentInformationSchema = Yup.object().shape({
  parentName: Yup.string().required('Parent/Guardian Name is required'),
  parentPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Parent phone number must be 10 digits')
    .required('Parent phone number is required')
    .test('unique-phone', 'Parent phone number must be different from student phone number', function(value) {
      const { phone } = this.parent;
      return value !== phone;
    }),
  parentEmail: Yup.string()
    .email('Invalid email format')
    .required('Parent email is required')
    .test('unique-email', 'Parent email must be different from student email', function(value) {
      const { email } = this.parent;
      return value !== email;
    }),
  parentOccupation: Yup.string().notRequired(),
  relationship: Yup.string().required('Relationship is required'),
  emergencyContactName: Yup.string().required('Emergency Contact Name is required'),
  emergencyContactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Emergency contact phone must be 10 digits')
    .required('Emergency contact phone is required')
    .test('unique-emergency-phone', 'Emergency contact phone must be different from student and parent phone numbers', function(value) {
      const { phone, parentPhone } = this.parent;
      return value !== phone && value !== parentPhone;
    }),
  emergencyContactRelationship: Yup.string().required(
    'Emergency Contact Relationship is required'
  ),
});

export const medicalInformationSchema = Yup.object().shape({
  medicalConditions: Yup.string().notRequired(),
  allergies: Yup.string().notRequired(),
  medications: Yup.string().notRequired(),
});


export const completeFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('First Name is required'),
  lastName: Yup.string()
    .trim()
    .required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  dateOfBirth: Yup.date()
    .required('Date of Birth is required')
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 4)),
      'Student must be at least 4 years old'
    ),
  gender: Yup.string().required('Gender is required'),
  bloodGroup: Yup.string().notRequired(),
  nationality: Yup.string().notRequired(),
  profileImage: Yup.mixed().required('select image'),
  grade: Yup.string().required('Grade is required'),
  class: Yup.string().required('Class is required'),
  rollNumber: Yup.number().required('Roll Number is required'),
  previousSchool: Yup.string().notRequired(),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
  parentName: Yup.string().required('Parent/Guardian Name is required'),
  parentPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Parent phone number must be 10 digits')
    .required('Parent phone number is required')
    .test('unique-parent-phone', 'Parent phone number must be different from student phone number', function(value) {
      const { phone } = this.parent;
      return value !== phone;
    }),
  parentEmail: Yup.string()
    .email('Invalid email format')
    .required('Parent email is required')
    .test('unique-parent-email', 'Parent email must be different from student email', function(value) {
      const { email } = this.parent;
      return value !== email;
    }),
  parentOccupation: Yup.string().notRequired(),
  relationship: Yup.string().required('Relationship is required'),
  emergencyContactName: Yup.string().required('Emergency Contact Name is required'),
  emergencyContactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Emergency contact phone must be 10 digits')
    .required('Emergency contact phone is required')
    .test('unique-emergency-phone', 'Emergency contact phone must be different from student and parent phone numbers', function(value) {
      const { phone, parentPhone } = this.parent;
      return value !== phone && value !== parentPhone;
    }),
  emergencyContactRelationship: Yup.string().required(
    'Emergency Contact Relationship is required'
  ),
  medicalConditions: Yup.string().notRequired(),
  allergies: Yup.string().notRequired(),
  medications: Yup.string().notRequired(),
});

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
