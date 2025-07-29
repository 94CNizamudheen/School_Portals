import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AdmissionFormData } from "../types/admission.types";
import  { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { RootState } from "./store";
import API from "../axios.config";

export interface StatusChangeData {
  status: 'approved' | 'rejected'|'completed';
  verificationNotes?: string;
  rejectionReason?: string;
}



export const fetchAdmissions = createAsyncThunk<AdmissionFormData[], void, { rejectValue: string; state: RootState }>(
  'admissions/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;

    try {
      const response = await API.get(`/admissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

export const handleStatusChange = async (id: string, data: StatusChangeData, token: string): Promise<void> => {
  try {
    const response = await API.patch(`/admissions/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log("response of status change",response)
    toast.success(`Application status ${data.status}`)
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || 'Failed to update status');
  }
}
export const fetchApplicationsByEmail = async (email: string,token:string): Promise<AdmissionFormData[]|undefined> => {
    try {
        const response = await API.get(`/admissions/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        console.log("response in fetch applications",response)
        return Array.isArray(response.data) ? response.data : [response.data]
    } catch (error) {
        const err= error as AxiosError<{message:string}>
        console.error(err.response?.data.message||'Failed to fetch data')
        return undefined
    }
}
