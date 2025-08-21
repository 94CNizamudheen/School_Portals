

export interface Subject {
    _id?: string;
    name: string;
    assignedTeachers?: string[];
    passMark: number;
    totalMark: number;
    subjectType: "Core" | "Language" | "Elective";
    createdAt?: string;
    updatedAt?:string
};