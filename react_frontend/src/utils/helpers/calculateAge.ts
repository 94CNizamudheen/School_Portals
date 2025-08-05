

export const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
export const ageRules: Record<string, { min: number; max: number }> = {
    LKG: { min: 4, max: 5 },
    UKG: { min: 5, max: 6 },
    "Class 1": { min: 6, max: 9 },
    "Class 2": { min: 7, max: 10 },
    "Class 3": { min: 8, max: 11 },
    "Class 4": { min: 9, max: 13 },
    "Class 5": { min: 10, max: 15 },
    "Class 6": { min: 11, max: 15 },
    "Class 7": { min: 12, max: 15 },
}