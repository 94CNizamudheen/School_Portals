import { Select } from "../ui/select"; 
import FormField from "./FormField";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Heart } from "lucide-react";



const ParentInformationSection = ({ formData, handleInputChange, errors }) => {
  const relations = ['Father', 'Mother', 'Guardian', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other'];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Parent/Guardian Information
        </CardTitle>
        <CardDescription className="text-purple-100">
          Contact details of parent or guardian
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="parentName"
            label="Parent/Guardian Name"
            required
            placeholder="Enter parent/guardian name"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="relationToStudent"
            label="Relation to Student"
            required
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          >
            <Select value={formData.relationToStudent} onValueChange={(value) => handleInputChange('relationToStudent', value)}>
              <SelectTrigger className={errors.relationToStudent ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="email"
            label="Email Address"
            type="email"
            required
            placeholder="Enter email address"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="mobileNumber"
            label="Mobile Number"
            required
            placeholder="Enter 10-digit mobile number"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <FormField
          name="parentOccupation"
          label="Occupation"
          placeholder="Enter parent/guardian occupation"
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </CardContent>
    </Card>
  );
};


export default ParentInformationSection