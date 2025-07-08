
"use client"
import { useAppSelector } from "@/app/store/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, LogOut, Key } from "lucide-react"
import Image from "next/image"

export default function StudentProfile() {
    const { student } = useAppSelector((state) => state.student)

    return (
        <div className="min-h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
            {/* Scrolling updates banner */}
            <div className="mb-4 bg-purple-600/50 rounded-lg p-2 overflow-hidden">
                <div className="animate-scroll whitespace-nowrap text-white text-sm">
                    Scrolling updates..... Scrolling updates..... Scrolling updates..... Scrolling updates..... Scrolling
                    updates..... Scroll
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Student Profile Card */}
                <Card className="bg-purple-700/80 border-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 rounded-full bg-white p-1">
                                <Image
                                    src="/placeholder.svg?height=88&width=88"
                                    alt="Student"
                                    width={88}
                                    height={88}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white">{student?.name || "Sample Name"}</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full text-center">
                                <div>
                                    <div className="text-sm text-purple-200">AGE</div>
                                    <div className="text-lg font-semibold">10</div>
                                </div>
                                <div>
                                    <div className="text-sm text-purple-200">CLASS</div>
                                    <div className="text-lg font-semibold">5</div>
                                </div>
                                <div>
                                    <div className="text-sm text-purple-200">DIVISION</div>
                                    <div className="text-lg font-semibold">B</div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" className="bg-purple-600 border-purple-500 text-white hover:bg-purple-500">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                                <Button variant="outline" className="bg-purple-600 border-purple-500 text-white hover:bg-purple-500">
                                    <Key className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Information Cards */}
                <div className="space-y-4">
                    {/* General Information */}
                    <Card className="bg-purple-700/80 border-purple-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                General Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-white/90 rounded-lg p-4 space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Student Name</label>
                                    <Input value={student?.name || "Sample Name"} className="mt-1" readOnly />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <Input value={student?.email || "sample@student.com"} className="mt-1" readOnly />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Roll Number</label>
                                    <Input value={student?.rollNumber || "S001"} className="mt-1" readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Other Information */}
                    <Card className="bg-purple-700/80 border-purple-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white">Other Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white/90 rounded-lg p-4 space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <Input value={student?.phone || "+1234567890"} className="mt-1" readOnly />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <Input value={student?.address || "123 Student Street, Education City"} className="mt-1" readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
