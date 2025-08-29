import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import API from '../axios.config';
import type { Student } from '../types/student';
import { updateStudent } from './studentSlice'; 
import type { Parent } from '../types/parent'; 


interface AssignParentPayload {
    parentId: string;
    studentIds: string[];
};

interface ParentState {
    parents: Parent[];
    parent: Parent | null;
    loading: boolean;
    error: string | null;
    childrens: Student[]
}


const initial: ParentState = { parents: [], parent: null, loading: false, error: null, childrens: [] };


export const fetchChildrenOfParent = createAsyncThunk(
    'parent/fetchChildrens',
    async (parentId: string, { rejectWithValue, }) => {
        try {
            const res = await API.get(`/parents/${parentId}/children`)
            return res.data;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message)
        }
    }
)

export const fetchParents = createAsyncThunk(
    'parent/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get(`/parents`,);
            console.log('parents data ', res.data)
            return res.data as Parent[];
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Fetch parents failed');
        }
    }
);

export const addParent = createAsyncThunk(
    'parent/add',
    async (parent: Omit<Parent, '_id'>, { rejectWithValue }) => {

        try {
            const res = await API.post(`/parents`, parent);
            console.log("response in parent add ")
            return res.data as Parent;
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Add parent failed');
        }
    }
);


export const updateParent = createAsyncThunk(
    'parent/update',
    async ({ id, updates }: { id: string; updates: Partial<Parent> }, { rejectWithValue }) => {
        try {
            const res = await API.patch(`/parents/${id}`, updates,);
            return res.data as Parent;
        } catch (err) {
            const e = err as AxiosError<{ message: string }>;
            return rejectWithValue(e.response?.data?.message || 'Update parent failed');
        }
    }
);


export const deleteParent = createAsyncThunk(
    'parent/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await API.delete(`/parents/${id}`);
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
            const response = await API.patch(`/parents/${parentId}`, { studentIds });
            return response.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data.message || 'failed to assign parent')
        }

    }
);

export const fetchParentByEmail = createAsyncThunk(
    'parent/fetchByEmail',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/parents/find-by-email/${email}`);
            console.log("response from fetch parent by id", response)
            return response.data
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            return rejectWithValue(error.response?.data.message || 'failed to fetch parent')
        }

    }
)

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
                s.parent = a.payload;
                const index = s.parents.findIndex(p => p._id === a.payload._id);
                if (index !== -1) {
                    s.parents[index] = a.payload;
                }
                s.loading = false;
            })
            .addCase(deleteParent.fulfilled, (s, a) => {
                s.parents = s.parents.filter(p => p._id !== a.payload);
            })
            .addCase(deleteParent.rejected, (s, a) => {
                s.error = a.payload as string;
            })
            .addCase(fetchParentByEmail.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchParentByEmail.fulfilled, (s, a) => {
                s.loading = false;
                s.parent = a.payload;
            })
            .addCase(fetchParentByEmail.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload as string;
            })
            .addCase(fetchChildrenOfParent.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchChildrenOfParent.fulfilled, (s, a) => {
                s.loading = false;
                s.childrens = a.payload;
            })
            .addCase(fetchChildrenOfParent.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload as string;
            })
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                const updatedStudent = action.payload;
                const index = state.childrens.findIndex(s => s._id === updatedStudent._id);
                if (index !== -1) {
                    state.childrens[index] = updatedStudent;
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export default slice.reducer;
