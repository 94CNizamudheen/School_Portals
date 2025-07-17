

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { teacherSchema } from "../../utils/validationSchemas";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addTeacher } from "../../store/teacherThunks";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import {SubjectField} from "../components/SubjectField";



type TeacherFormValues = Yup.InferType<typeof teacherSchema>;
const AddTeacherPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [photo, setPhoto] = useState<File | null>(null);
  
  const defaultValues: TeacherFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    dob: "",
    university: "",
    degree: "",
    experienceYears: 0,
    subjects: [],
    profileImage:''
  }
  const form = useForm<TeacherFormValues>({
    resolver: yupResolver(teacherSchema),
    defaultValues,
  });

  const onSubmit = (data: TeacherFormValues) => {
    if (photo) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (photo.size > maxSizeInBytes) {
        toast.error("Image size should not exceed 5 MB.");
        return;
      }
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key,item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (photo) formData.append("profileImage", photo);
    dispatch(addTeacher(formData));
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Teacher</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-gray-800 p-6 rounded-md shadow"
        >
          {/* Personal Details */}
          <div className="border p-4 rounded-md bg-gray-200 ">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900 ">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900"  {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900" type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="mobileNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900"  {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address *</FormLabel>
                    <FormControl><Textarea className="  border-gray-300 text-gray-900"  {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dob"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl><Input type="date" className="  border-gray-300 text-gray-900"  {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Photo *</FormLabel>
                <div className="border border-dashed p-4 text-sm rounded bg-gray-100">
                  <input
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="border p-4 rounded-md bg-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-purple-700">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900" >
              <FormField
                name="university"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900"  {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="degree"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree *</FormLabel>
                    <FormControl><Input className="  border-gray-300 text-gray-900"  {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="experienceYears"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl><Input type="number" className="border-gray-300 text-gray-900" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubjectField control={form.control} />

            </div>
          </div>

          <Button type="submit" className="ml-auto block">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
export default AddTeacherPage