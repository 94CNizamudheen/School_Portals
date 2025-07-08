"use client"

import * as React from "react"
import { fetchStudentByEmail } from "@/app/store/studentSlice"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, BookOpen, Users, Award, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  const dispatch = useAppDispatch()
  const { student, loading } = useAppSelector((state) => state.student)

  React.useEffect(() => {
    if (!student) {
      dispatch(fetchStudentByEmail("john.doe@student.amlp.edu"))
      
    }
  }, [dispatch, student])

  const stats = [
    { title: "Attendance", value: "92%", description: "This month", icon: Calendar, color: "text-purple-300" },
    { title: "Assignments", value: "8/10", description: "Completed", icon: BookOpen, color: "text-purple-300" },
    { title: "Average Grade", value: "A-", description: "Current semester", icon: Award, color: "text-purple-300" },
    { title: "Study Hours", value: "24h", description: "This week", icon: Clock, color: "text-purple-300" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-2 text-purple-200">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-purple-200">Welcome back, {student?.name || "Student"}! Here is your academic overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-purple-900/80 border-purple-600/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-purple-200">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-purple-900/80 border-purple-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-100">Upcoming Assignments</CardTitle>
              <CardDescription className="text-purple-200">Do not forget these deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">History Project</p>
                    <p className="text-sm text-purple-200">Due in 3 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-800 hover:bg-purple-700 hover:text-white">
                    View
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Physics Lab Report</p>
                    <p className="text-sm text-purple-200">Due in 5 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-800 hover:bg-purple-700 hover:text-white">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/80 border-purple-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-100">Quick Actions</CardTitle>
              <CardDescription className="text-purple-200">Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col bg-transparent border-purple-500 text-purple-100 hover:bg-purple-700 hover:text-white">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Timetable</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent border-purple-500 text-purple-100 hover:bg-purple-700 hover:text-white">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-sm">Assignments</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent border-purple-500 text-purple-100 hover:bg-purple-700 hover:text-white">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Teachers</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent border-purple-500 text-purple-100 hover:bg-purple-700 hover:text-white">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-sm">Grades</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}