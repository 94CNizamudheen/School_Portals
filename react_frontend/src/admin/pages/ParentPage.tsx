import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParents, deleteParent, fetchChildrenOfParent } from '../../store/parentSlice';
import type { Parent } from '../../types/parent';
import type { RootState, AppDispatch } from '../../store/store';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Trash2, Eye, UserPlus, Users, Mail, Phone, Briefcase, Heart, Baby } from 'lucide-react';
import { ViewChildrenModal } from '../components/ViewChildrenModal';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { CustomPagination } from '../../components/shared/CustomPagination';
import { AssignChildrenModal } from '../components/AssignChildrenModal';
import { fetchAllStudents } from '../../store/studentThunks';
import { assignParent } from '../../store/parentSlice';
import StatusFilterWithSearch from '../../components/shared/filters';
import type { Student } from '../../types/student';

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

    const filterdParents = parents.filter((parent) => {
        const matchStatus = statusFilter === 'all' || parent.relationship?.toLocaleLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) || parent.mobileNumber.includes(searchTerm)
        return matchStatus && matchesSearch
    }).sort((a,b)=> new Date(b.createdAt??'').getTime()-new Date(a.createdAt??'').getTime() )

    const parentsPerPage = 9;
    const indexOfLastParent = currentPage * parentsPerPage;
    const indexOfFirstParent = indexOfLastParent - parentsPerPage;
    const currentParents = filterdParents.slice(indexOfFirstParent, indexOfLastParent);
    const totalPages = Math.ceil(filterdParents.length / parentsPerPage);

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

    const getRelationshipIcon = (relationship: string) => {
        switch (relationship?.toLowerCase()) {
            case 'father':
            case 'mother':
                return <Heart className="w-4 h-4" />;
            case 'guardian':
                return <Users className="w-4 h-4" />;
            default:
                return <Users className="w-4 h-4" />;
        }
    };

    const getRelationshipColor = (relationship: string) => {
        switch (relationship?.toLowerCase()) {
            case 'father':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'mother':
                return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'guardian':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
            <div className="container mx-auto px-6 py-8">
            
                <div className="mb-8 ">
                    <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl shadow-lg">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-500 to-gray-100 bg-clip-text text-transparent">
                                        Parent Management
                                    </h1>
                                    <p className="text-gray-300 mt-1">Manage parent profiles and child assignments</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Parents</p>
                                        <p className="text-2xl font-bold text-gray-800">{parents.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Baby className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">With Children</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {parents.filter(p => p.studentIds && p.studentIds.length > 0).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <UserPlus className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Unassigned</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {parents.filter(p => !p.studentIds || p.studentIds.length === 0).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <StatusFilterWithSearch
                            onFilterChange={handleStatusChange}
                            onSearchChange={handleSearchQuery}
                        />
                    </div>
                </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-gray-600"></div>
                        <p className="text-gray-600 mt-4 text-center font-medium">Loading parents...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                    <p className="text-red-600 font-medium">Error: {error}</p>
                </div>
            ) : (
                <>
                {/* Parents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentParents.map(parent => (
                            <Card
                                key={parent._id}
                                className="group relative overflow-hidden bg-gradient-to-br from-white via-gray-500 to-white hover:shadow-2xl backdrop-blur-sm border-0 shadow-lg  transform hover:scale-[1.02] transition-all duration-500 rounded-3xl min-w-0"
                            >
                                {/* Gradient Overlay */}

                                <CardHeader className="relative z-10 pb-4 ">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                                                <Users className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                                    {parent.name}
                                                </CardTitle>
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRelationshipColor(parent.relationship || '')}`}>
                                                    {getRelationshipIcon(parent.relationship || '')}
                                                    <span>{parent.relationship || 'Guardian'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Children Count Badge */}
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                            {parent.studentIds?.length || 0}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            onClick={() => handleViewChildren(parent)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
                                            size="sm"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Children
                                        </Button>

                                        {(!parent.studentIds?.length) && (
                                            <Button
                                                onClick={() => setAssigningParent(parent)}
                                                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
                                                size="sm"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Assign
                                            </Button>
                                        )}

                                        <Button
                                            onClick={() => handleDelete(parent)}
                                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl p-2 transition-all duration-300"
                                            size="sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 pt-0 space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Mail className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                                            <p className="text-sm font-medium text-gray-800 truncate">{parent.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Phone className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 mb-1">Mobile</p>
                                            <p className="text-sm font-medium text-gray-800">{parent.mobileNumber}</p>
                                        </div>
                                    </div>

                                    {parent.occupation && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Briefcase className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Occupation</p>
                                                <p className="text-sm font-medium text-gray-800">{parent.occupation}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>

                                {/* Hover Effects */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {currentParents.length === 0 && (
                        <div className="text-center py-20">
                            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No parents found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </>
            )}

            {/* Enhanced Pagination */}
            {filterdParents.length > 0 && (
                <div className="mt-8">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modals */}
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