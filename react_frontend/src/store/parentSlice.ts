import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import API from '../axios.config';

interface AssignParentPayload {
    parentId: string;
    studentIds: string[];
}

export interface Parent {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    occupation?: string;
    relationship?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    studentIds?: string[];
}

interface ParentState {
    parents: Parent[];
    loading: boolean;
    error: string | null;
}
export interface Child {
    _id: string;
    firstName: string;
    lastName: string;
}

const initial: ParentState = { parents: [], loading: false, error: null };


export const fetchChildrenOfParent = createAsyncThunk(
    'parent/fetchChildrens',
    async (parentId: string, { rejectWithValue, }) => {
        try {
            const res = await axios.get(`${API}/parents/${parentId}/children`)
            return res.data as Child[];

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message)
        }
    }
)

// Fetch all parents
export const fetchParents = createAsyncThunk(
    'parent/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API}/parents`,);
            console.log('parents',res.data)
            return res.data as Parent[];
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Fetch parents failed');
        }
    }
);

// Add a new parent
export const addParent = createAsyncThunk(
    'parent/add',
    async (parent: Omit<Parent, '_id'>, { rejectWithValue }) => {

        try {
            const res = await axios.post(`${API}/parents`, parent);
            console.log("response in parent add ")
            return res.data as Parent;
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Add parent failed');
        }
    }
);

// Update parent
export const updateParent = createAsyncThunk(
    'parent/update',
    async (
        { id, updates }: { id: string; updates: Partial<Parent> },
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.put(`${API}/parents/${id}`, updates,);
            return res.data as Parent;
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Update parent failed');
        }
    }
);

// Delete parent
export const deleteParent = createAsyncThunk(
    'parent/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API}/parents/${id}`);
            return id;
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Delete parent failed');
        }
    }
);
export const assignParent = createAsyncThunk(
    'parent/assignParent',
    async ({ parentId, studentIds }: AssignParentPayload, { rejectWithValue, }) => {
        try {
            const response = await axios.patch(`${API}/parents/${parentId}`, { studentIds });
            return response.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data.message || 'failed to assign parent')
        }

    }
);


const slice = createSlice({
    name: 'parent',
    initialState: initial,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchParents.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchParents.fulfilled, (s, a) => {
                s.loading = false;
                s.parents = a.payload;
            })
            .addCase(fetchParents.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload as string;
            })
            .addCase(addParent.fulfilled, (s, a) => {
                s.parents.push(a.payload);
            })
            .addCase(updateParent.fulfilled, (s, a) => {
                const idx = s.parents.findIndex(p => p._id === a.payload._id);
                if (idx !== -1) s.parents[idx] = a.payload;
            })
            .addCase(deleteParent.fulfilled, (s, a) => {
                s.parents = s.parents.filter(p => p._id !== a.payload);
            })
            .addCase(deleteParent.rejected, (s, a) => {
                s.error = a.payload as string;
            })
    }
});

export default slice.reducer;
