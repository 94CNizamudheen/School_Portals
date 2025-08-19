
export const generateStudentId=():string=>{
    const prefix= 'AUP'+new Date().getFullYear();
    const random= Math.floor(1000 + Math.random()*9000);
    return prefix+random
}