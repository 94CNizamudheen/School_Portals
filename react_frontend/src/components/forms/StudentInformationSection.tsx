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

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
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

        <FormField
          name="address"
          label="Address"
          required
          placeholder="Enter complete address"
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
        >
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter complete address"
            className={errors.address ? 'border-red-500' : ''}
            rows={3}
          />
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

export default StudentInformationSection