import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParents, addParent, updateParent, deleteParent, fetchChildrenOfParent } from '../../store/parentSlice';
import type { Parent } from '../../store/parentSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Trash2, Pencil } from 'lucide-react';
import { AddEditParentModal } from '../components/AddEditParentModal';
import { ViewChildrenModal } from '../components/ViewChildrenModal';
import type { Child } from '../../store/parentSlice';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { Pagination } from '../../components/shared/Pagination';
import { AssignChildrenModal } from '../components/AssignChildrenModal';
import {  fetchAllStudents } from '../../store/studentSlice';
import { assignParent } from '../../store/parentSlice';


const ParentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { parents, loading, error } = useSelector((s: RootState) => s.parent);
    const students= useSelector((state:RootState)=>state.student.students)
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Parent | null>(null);
    const [viewing, setViewing] = useState<Parent | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [assigningParent, setAssigningParent] = useState<Parent | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const parentsPerPage = 9;

    const indexOfLastParent = currentPage * parentsPerPage;
    const indexOfFirstParent = indexOfLastParent - parentsPerPage;
    const currentParents = parents.slice(indexOfFirstParent, indexOfLastParent);
    const totalPages = Math.ceil(parents.length / parentsPerPage);

    console.log("students ",students)
    console.log("Parents from Redux:", parents);

    const [form, setForm] = useState<Omit<Parent, '_id' | 'studentIds'>>({
        name: '',
        email: '',
        mobileNumber: '',
        occupation: '',
        relationship: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
    });



    useEffect(() => {
        dispatch(fetchParents());
        dispatch(fetchAllStudents())
    }, [dispatch]);

    const openAdd = () => {
        setEditing(null);
        setForm({
            name: '',
            email: '',
            mobileNumber: '',
            occupation: '',
            relationship: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelationship: ''
        });
        setModalOpen(true);
    };

    const openEdit = (p: Parent) => {
        setEditing(p);
        const {
            name,
            email,
            mobileNumber,
            occupation,
            relationship,
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactRelationship
        } = p;
        setForm({ name, email, mobileNumber, occupation, relationship, emergencyContactName, emergencyContactPhone, emergencyContactRelationship });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await dispatch(updateParent({ id: editing._id, updates: form })).unwrap();
            } else {
                await dispatch(addParent(form));
            }
            setModalOpen(false);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message)
            }

        }

    };

    const handleDelete = (p: Parent) => {
        const count = p.studentIds?.length ?? 0;
        if (count > 0 && count === 1) {
            alert('Cannot delete parent linked as the only parent of a student.');
            return;
        }
        if (confirm('Delete this parent?')) {
            dispatch(deleteParent(p._id));
        }
    };

    const handleViewChildren = async (p: Parent) => {
        try {
            const res = await dispatch(fetchChildrenOfParent(p._id)).unwrap();
            setChildrenList(res)
            setViewing(p)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message)
            }

        }
    };

    const handleAssignChildren =async (parent: Parent,selectedIds:string[]) => {
       try {
        await dispatch(assignParent({parentId:parent._id,studentIds:selectedIds})).unwrap();
        toast.success('Parent assigned successfully')
         dispatch(fetchParents());
        setAssigningParent(null)
       } catch (error) {
        const err= error as AxiosError<{message:string}>;
        toast.error(err.response?.data.message||'failed to assign parent')
       }
    };

    return (
        <div className="min-h-screen bg-gray-800 p-8">
            <h1 className="text-3xl text-white font-bold mb-4">Manage Parents</h1>
            <Button className="mb-4" onClick={openAdd}>Add Parent</Button>

            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentParents.map(p => (
                    <Card key={p._id}>
                        <CardHeader>
                            <CardTitle className="text-lg mb-2">{p.name}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewChildren(p)}>View Children</Button>
                                {!p.studentIds?.length && (
                                    <Button variant="outline" size="sm" onClick={() => setAssigningParent(p)}>Assign</Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(p)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Email:</strong> {p.email}</p>
                            <p><strong>Mobile:</strong> {p.mobileNumber}</p>
                            <p><strong>Occupation:</strong> {p.occupation || 'N/A'}</p>
                            <p><strong>Relationship:</strong> {p.relationship || 'N/A'}</p>
                            <p><strong>Emergency Contact:</strong> {p.emergencyContactName} – {p.emergencyContactPhone}</p>
                            <p><strong>Children:</strong> {p.studentIds?.length || 0}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Add/Edit Modal */}
            {modalOpen && (
                <AddEditParentModal
                    editing={!!editing}
                    form={form}
                    onChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* View Children Modal */}
            {viewing && (
                <ViewChildrenModal
                    name={viewing.name}
                    childrenList={childrenList}
                    onClose={() => setViewing(null)}
                />
            )}
            {assigningParent && (
                <AssignChildrenModal
                    open={!!assigningParent}
                    parent={assigningParent}
                    students={students} 
                    onClose={() => setAssigningParent(null)}
                    onAssign={(selectedIds) => {handleAssignChildren(assigningParent,selectedIds);}}
                />
            )}

        </div>
    );
};

export default ParentPage;
