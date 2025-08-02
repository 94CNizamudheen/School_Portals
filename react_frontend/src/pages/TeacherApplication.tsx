import { useState } from 'react';
import * as Yup from 'yup';
import { teacherValidationSchema } from '../utils/validationSchemas';
import { mapYupErrors } from '../utils/validationHelpers'; 
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField'; 
import FileUploadArea from '../components/forms/FileUploadArea';
import { Check } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  university: string;
  qualification: string;
  city: string;
  subject: string;
  teachingLevel: string;
  experience: string ;
  certificateNo: string;
}

interface FileData {
  photo: File | null;
  documents: File[];
}

export default function TeacherApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    university: '',
    qualification: '',
    city: '',
    subject: '',
    teachingLevel: '',
    experience: '',
    certificateNo: ''
  });

  const [files, setFiles] = useState<FileData>({
    photo: null,
    documents: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFileUpload = (type: 'photo' | 'documents', event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (type === 'photo') {
      setFiles((prev) => ({ ...prev, photo: selectedFiles[0] }));
    } else {
      setFiles((prev) => ({
        ...prev,
        documents: [...prev.documents, ...selectedFiles]
      }));
    }
  };

  const removeFile = (type: 'photo' | 'documents', index?: number) => {
    if (type === 'photo') {
      setFiles((prev) => ({ ...prev, photo: null }));
    } else if (typeof index === 'number') {
      setFiles((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await teacherValidationSchema.validate(formData, { abortEarly: false });
      alert('Form submitted successfully!');
      setErrors({});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const formattedErrors = mapYupErrors(err);
        setErrors(formattedErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 sm:p-6">
      <div className="w-full lg:w-[60%] mx-auto">
        <div className=" bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Teacher Application</h1>
            <p className="text-purple-100 text-lg">Join our educational community</p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Personal Details */}
            <section className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  field="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.firstName}
                  touched={touched.firstName}
                />
                <InputField
                  label="Last Name"
                  field="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.lastName}
                  touched={touched.lastName}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  field="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  field="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.phone}
                  touched={touched.phone}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    field="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    touched={touched.address}
                  />
                </div>
                <InputField
                  label="Date of Birth"
                  type="date"
                  field="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.dateOfBirth}
                  touched={touched.dateOfBirth}
                />
                <FileUploadArea
                  label="Profile Photo"
                  type="photo"
                  accept="image/*"
                  multiple={false}
                  files={files}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                />
              </div>
            </section>

            {/* Section 2: Education Background */}
            <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                Education Background
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="University / Institution"
                  field="university"
                  placeholder="Enter university name"
                  value={formData.university}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.university}
                  touched={touched.university}
                  className="md:col-span-2"
                />
                <SelectField
                  label="Highest Qualification"
                  field="qualification"
                  options={[
                    { value: 'bed', label: 'B.Ed' },
                    { value: 'med', label: 'M.Ed' },
                    { value: 'ma', label: 'MA' },
                    { value: 'msc', label: 'MSc' },
                    { value: 'phd', label: 'PhD' }
                  ]}
                  value={formData.qualification}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.qualification}
                  touched={touched.qualification}
                />
                <InputField
                  label="City"
                  field="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.city}
                  touched={touched.city}
                />
              </div>
            </section>

            {/* Section 3: Subject Specialization */}
            <section className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                Subject Specialization & Eligibility
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Subject"
                  field="subject"
                  options={[
                    { value: 'malayalam', label: 'Malayalam' },
                    { value: 'english', label: 'English' },
                    { value: 'hindi', label: 'Hindi' },
                    { value: 'maths', label: 'Mathematics' },
                    { value: 'science', label: 'Science' },
                    { value: 'social', label: 'Social Science' },
                    { value: 'arabic', label: 'Arabic' },
                    { value: 'sanskrit', label: 'Sanskrit' }
                  ]}
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                  touched={touched.subject}
                />
                <SelectField
                  label="Teaching Level"
                  field="teachingLevel"
                  options={[
                    { value: 'lp', label: 'Lower Primary (LP)' },
                    { value: 'up', label: 'Upper Primary (UP)' }
                  ]}
                  value={formData.teachingLevel}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.teachingLevel}
                  touched={touched.teachingLevel}
                />
                <InputField
                  label="Years of Experience"
                  type="number"
                  field="experience"
                  placeholder="Enter years of experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.experience}
                  touched={touched.experience}
                />
                <InputField
                  label="KTET/CTET Certificate No."
                  field="certificateNo"
                  placeholder="Enter certificate number"
                  value={formData.certificateNo}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.certificateNo}
                  touched={touched.certificateNo}
                />
                <div className="md:col-span-2">
                  <FileUploadArea
                    label="Upload Eligibility Documents"
                    type="documents"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={true}
                    files={files}
                    onUpload={handleFileUpload}
                    onRemove={removeFile}
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200 flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
