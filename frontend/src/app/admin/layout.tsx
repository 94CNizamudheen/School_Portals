'use client'



import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
const API= process.env.NEXT_PUBLIC_BACKEND_URL;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const checkAdminAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.replace('/admin/login');
                return;
            }
            try {
                const response = await axios.get(`${API}/auth/verify-token`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if(response.data?.user?.role!=='ADMIN'){
                    router.replace('/unauthorized')
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                router.replace('/admin/login')
            }
        }
        checkAdminAuth()
    })

    return <>{children}</>
}

export default AdminLayout

