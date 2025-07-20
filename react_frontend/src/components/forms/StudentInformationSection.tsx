import FormField from "./FormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import type { AdmissionFormData, AdmissionFormErrors, HandleInputChange } from "../../types/admission.types";

import type React from "react";
import { User } from "lucide-react";

interface StudentInformationSectionProps {
  formData: AdmissionFormData;
  handleInputChange: HandleInputChange;
  errors: AdmissionFormErrors;
}

const StudentInformationSection: React.FC<StudentInformationSectionProps> = ({ formData, handleInputChange, errors }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const classes = ['LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7',];
  
  // Indian states and union territories
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
    'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Common nationalities
  const nationalities = [
    'Indian', 'American', 'British', 'Canadian', 'Australian', 'German', 'French', 
    'Japanese', 'Chinese', 'Russian', 'Brazilian', 'South African', 'Nigerian', 
    'Egyptian', 'Saudi Arabian', 'UAE', 'Singaporean', 'Malaysian', 'Thai', 
    'Indonesian', 'Filipino', 'Korean', 'Italian', 'Spanish', 'Dutch', 'Swedish',
    'Norwegian', 'Danish', 'Finnish', 'Swiss', 'Austrian', 'Belgian', 'Portuguese',
    'Greek', 'Turkish', 'Israeli', 'Iranian', 'Pakistani', 'Bangladeshi', 'Sri Lankan',
    'Nepali', 'Bhutanese', 'Myanmarese', 'Vietnamese', 'Cambodian', 'Laotian'
  ].sort();

  return (
    <Card className="shadow-lg p-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg ">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Information
        </CardTitle>
        <CardDescription className="text-blue-100">
          Basic details about the student
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="firstName"
            label="First Name"
            required
            placeholder="Enter first name"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="lastName"
            label="Last Name"
            required
            placeholder="Enter last name"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="dob"
            label="Date of Birth"
            type="date"
            required
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="bloodGroup"
            label="Blood Group"
            required
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          >
            <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
              <SelectTrigger className={errors.bloodGroup ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Address Section */}
        <FormField
          name="address"
          label="Address"
          required
          placeholder="Enter house number, street, locality"
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
        >
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter house number, street, locality"
            className={errors.address ? 'border-red-500' : ''}
            rows={3}
          />
        </FormField>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="state"
            label="State"
            required
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          >
            <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            name="pincode"
            label="Pincode"
            required
            placeholder="Enter 6-digit pincode"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <FormField
          name="nationality"
          label="Nationality"
          required
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
        >
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="previousSchool"
            label="Previous School"
            placeholder="Enter previous school name (if any)"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="classApplied"
            label="Class Applied For"
            required
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          >
            <Select value={formData.classApplied} onValueChange={(value) => handleInputChange('classApplied', value)}>
              <SelectTrigger className={errors.classApplied ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField
          name="medicalInformation"
          label="Medical Information"
          placeholder="Any medical conditions, allergies, or special needs"
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
        >
          <Textarea
            id="medicalInformation"
            value={formData.medicalInformation}
            onChange={(e) => handleInputChange('medicalInformation', e.target.value)}
            placeholder="Any medical conditions, allergies, or special needs"
            rows={3}
          />
        </FormField>
      </CardContent>
    </Card>
  );
};

export default StudentInformationSection;