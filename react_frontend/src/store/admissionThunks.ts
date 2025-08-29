import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AdmissionFiles, AdmissionFormBody, AdmissionFormData } from "../types/admission.types";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { RootState } from "../types/store.types";
import API from "../axios.config";

export interface StatusChangeData {
  status: 'approved' | 'rejected' | 'completed';
  verificationNotes?: string;
  rejectionReason?: string;
}
interface PaymentPayload {
  admissionId: string;
  amount: number;
  transactionId: string;
}



export const fetchAdmissions = createAsyncThunk<AdmissionFormData[], void, { rejectValue: string; state: RootState }>(
  'admissions/fetchAll',
  async (_, { rejectWithValue, }) => {

    try {
      const response = await API.get(`/admissions`, {
      });
      return response.data as AdmissionFormData[];
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || 'Failed to fetch admissions';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const handleStatusChange = createAsyncThunk<AdmissionFormData, { id: string; data: StatusChangeData }>(
  "admissions/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/admissions/${id}`, data);
      console.log(response)
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const fetchApplicationsByEmail = createAsyncThunk<AdmissionFormData[], string, { rejectValue: string }>(
  "admissions/fetchByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.get(`/admissions/${email}`);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const completeAdmissionPayment = createAsyncThunk<AdmissionFormData, PaymentPayload>(
  "admissions/completePayment",
  async ({ admissionId, amount, transactionId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/payments/admission-payment`, { admissionId, amount, transactionId, });
      return response.data as AdmissionFormData;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);
export const createAdmission = async (form: AdmissionFormBody, files: AdmissionFiles): Promise<{ message: string }> => {
  const data = new FormData();
  (Object.keys(form) as (keyof AdmissionFormBody)[]).forEach((key) => {
    const value = form[key];
    if (value !== undefined && value !== null) {
      data.append(key, value.toString());
    }
  })
  if (files.profilePicture) data.append('profilePicture', files.profilePicture);
  if (files.aadharDocument) data.append('aadharDocument', files.aadharDocument);
  if (files.birthCertificate) data.append('birthCertificate', files.birthCertificate);
  if (files.transferCertificate) data.append('transferCertificate', files.transferCertificate);

  try {
    const response = await API.post(`/admissions`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("response of create admission", response)
    return response.data
  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    throw err
  }
}

