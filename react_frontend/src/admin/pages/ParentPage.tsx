import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParents, deleteParent, fetchChildrenOfParent } from '../../store/parentSlice';
import type { Parent } from '../../store/parentSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Trash2, /*Pencil*/ } from 'lucide-react';
import { ViewChildrenModal } from '../components/ViewChildrenModal';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { CustomPagination } from '../../components/shared/CustomPagination';
import { AssignChildrenModal } from '../components/AssignChildrenModal';
import { fetchAllStudents } from '../../store/studentThunks';
import { assignParent } from '../../store/parentSlice';
import StatusFilterWithSearch from '../../components/shared/filters';
import type { Student } from '@/types/student';
// import { AddParentModal } from '../components/modals/AddParentModal';


const ParentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { parents, loading, error } = useSelector((s: RootState) => s.parent);
    const students = useSelector((state: RootState) => state.student.students)
    const [viewing, setViewing] = useState<Parent | null>(null);
    const [childrenList, setChildrenList] = useState<Student[]>([]);
    const [assigningParent, setAssigningParent] = useState<Parent | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('')
    // const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filterdParents = parents.filter((parent) => {
        const matchStatus = statusFilter === 'all' || parent.relationship?.toLocaleLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) || parent.mobileNumber.includes(searchTerm)
        return matchStatus && matchesSearch
    })

    const parentsPerPage = 9;
    const indexOfLastParent = currentPage * parentsPerPage;
    const indexOfFirstParent = indexOfLastParent - parentsPerPage;
    const currentParents = filterdParents.slice(indexOfFirstParent, indexOfLastParent);
    const totalPages = Math.ceil(parents.length / parentsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchTerm]);




    useEffect(() => {
        dispatch(fetchParents());
        dispatch(fetchAllStudents())
    }, [dispatch]);


    const handleDelete = (p: Parent) => {
        const childrenIds = p.studentIds || [];

        if (childrenIds.length === 0) {
            if (confirm('Delete this parent?')) {
                dispatch(deleteParent(p._id));
            }
            return;
        }
        const childrenWithSingleParent = childrenIds.filter(childId => {
            const child = students.find(s => s._id === childId);
            if (!child) return false;
            const parentCount = child.parentIds?.length ?? 0;

            return parentCount === 1 && child.parentIds?.[0] === p._id;
        });

        if (childrenWithSingleParent.length > 0) {
            alert('Cannot delete parent because some children have no other parent assigned.');
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

    const handleAssignChildren = async (parent: Parent, selectedIds: string[]) => {
        try {
            await dispatch(assignParent({ parentId: parent._id, studentIds: selectedIds })).unwrap();
            toast.success('Parent assigned successfully')
            dispatch(fetchParents());
            setAssigningParent(null)
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data.message || 'failed to assign parent')
        }
    };


    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
    }
    const handleSearchQuery = (value: string) => {
        setSearchTerm(value)
    }

    return (
        <div className="min-h-screen bg-gray-800 p-8">
            <h1 className="text-3xl text-white font-bold mb-4">Manage Parents</h1>

            {/* <div className="flex justify-between items-center mb-4">
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Add Parent
                </Button>
            </div> */}
            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}
            <StatusFilterWithSearch
                onFilterChange={handleStatusChange}
                onSearchChange={handleSearchQuery}
            />


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                {currentParents.map(p => (
                    <Card key={p._id}>
                        <CardHeader>
                            <CardTitle className="text-lg mb-2">{p.name}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewChildren(p)}>View Children</Button>
                                {!p.studentIds?.length && (
                                    <Button variant="outline" size="sm" onClick={() => setAssigningParent(p)}>Assign</Button>
                                )}
                                {/* <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button> */}
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(p)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Email:</strong> {p.email}</p>
                            <p><strong>Mobile:</strong> {p.mobileNumber}</p>
                            <p><strong>Occupation:</strong> {p.occupation || 'N/A'}</p>
                            <p><strong>Relationship:</strong> {p.relationship || 'N/A'}</p>
                            <p><strong>Children:</strong> {p.studentIds?.length || 0}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
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
                    onAssign={(selectedIds) => { handleAssignChildren(assigningParent, selectedIds); }}
                />
            )}
            {/* {isAddModalOpen && (
                <AddParentModal
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )} */}


        </div>
    );
};

export default ParentPage;
