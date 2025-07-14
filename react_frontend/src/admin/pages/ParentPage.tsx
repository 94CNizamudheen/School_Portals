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
import { isAxiosError } from 'axios';

const ParentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { parents, loading, error } = useSelector((s: RootState) => s.parent);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Parent | null>(null);
    const [viewing, setViewing] = useState<Parent | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);

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

    const handleSave = () => {
        try {
            if (editing) {
            dispatch(updateParent({ id: editing._id, updates: form }));
        } else {
            dispatch(addParent(form));
        }
        setModalOpen(false);
        } catch (error) {
            if(isAxiosError(error)){
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
            const res= await dispatch(fetchChildrenOfParent(p._id)).unwrap();
            setChildrenList(res)
            setViewing(p)
        } catch (error) {
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message)
            }
            
        }
    };

    const handleAssignChildren = (p: Parent) => {
        alert(`Open assign children modal for ${p.name}`); // You can replace this with a real modal
    };

    return (
        <div className="min-h-screen bg-gray-800 p-8">
            <h1 className="text-3xl text-white font-bold mb-4">Manage Parents</h1>
            <Button className="mb-4" onClick={openAdd}>Add Parent</Button>

            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parents.map(p => (
                    <Card key={p._id}>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-lg">{p.name}</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewChildren(p)}>View Children</Button>
                                {!p.studentIds?.length && (
                                    <Button variant="outline" size="sm" onClick={() => handleAssignChildren(p)}>Assign</Button>
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
        </div>
    );
};

export default ParentPage;
