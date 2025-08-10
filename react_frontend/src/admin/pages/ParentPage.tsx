import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParents, deleteParent, fetchChildrenOfParent } from '../../store/parentSlice';
import type { Parent } from '../../store/parentSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Trash2, /*Pencil*/ } from 'lucide-react';
import { ViewChildrenModal } from '../components/ViewChildrenModal';
import type { Child } from '../../store/parentSlice';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { CustomPagination } from '../../components/shared/CustomPagination';
import { AssignChildrenModal } from '../components/AssignChildrenModal';
import { fetchAllStudents } from '../../store/studentThunks';
import { assignParent } from '../../store/parentSlice';
import StatusFilterWithSearch from '../../components/shared/filters';


const ParentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { parents, loading, error } = useSelector((s: RootState) => s.parent);
    const students = useSelector((state: RootState) => state.student.students)
    const [viewing, setViewing] = useState<Parent | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [assigningParent, setAssigningParent] = useState<Parent | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('')

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

        </div>
    );
};

export default ParentPage;
