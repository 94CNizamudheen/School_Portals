
'use client'
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
const PortalPage = dynamic(() => import('@/components/PortalsPage'), {
    loading: () => <Loading />,
    ssr: false
})
export default function Page(){
    return <PortalPage/>
}