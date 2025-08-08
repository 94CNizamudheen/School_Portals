
import type { LucideIcon } from "lucide-react";
import { Home, User, Calendar, BookOpen, Users, FileText, Clock, File, MessageSquare, ClipboardList } from "lucide-react";

export interface NavItem {
  icon: LucideIcon; 
  label: string;
  route: string;
}

export const navConfig: Record<string,NavItem []> = {
  student: [
    { icon: Home, label: "Dashboard", route: "/student/dashboard" },
    { icon: User, label: "Profile", route: "/student/profile" },
    { icon: Calendar, label: "Attendance", route: "/student/attendance" },
    { icon: BookOpen, label: "Tasks/Homework", route: "/student/tasks" },
    { icon: Clock, label: "TimeTable", route: "/student/timetable" },
    { icon: Users, label: "Teachers", route: "/student/teachers" },
    { icon: FileText, label: "Exams / Results", route: "/student/results" },
  ],
  teacher: [
    { icon: Home, label: "Dashboard", route: "/teacher/dashboard" },
    { icon: Users, label: "Student List", route: "/teacher/students" },
    { icon: Calendar, label: "Attendance Mgt", route: "/teacher/attendance" },
    { icon: BookOpen, label: "Assignments", route: "/teacher/assignments" },
    { icon: FileText, label: "Exam & Grades", route: "/teacher/exams" },
    { icon: ClipboardList, label: "Announcements", route: "/teacher/announcements" },
    { icon: Clock, label: "Time Table", route: "/teacher/timetable" },
    { icon: User, label: "Profile & Settings", route: "/teacher/profile" },
    { icon: MessageSquare, label: "Chats", route: "/teacher/chats" },
  ],
  parent: [
    { icon: Home, label: "Dashboard", route: "/parent/dashboard" },
    { icon: User, label: "Student Info", route: "/parent/student-info" },
    { icon: FileText, label: "Grades & Reports", route: "/parent/grades" },
    { icon: Calendar, label: "Attendance Overview", route: "/parent/attendance" },
    { icon: File, label: "Fee Info", route: "/parent/fees" },
    { icon: Users, label: "Teachers", route: "/parent/teachers" },
    { icon: Clock, label: "Time Table", route: "/parent/timetable" },
  ],
};
