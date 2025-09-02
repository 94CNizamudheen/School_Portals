


export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatToDDMMYYYY=(dateStr: string)=> {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  return `${day}-${month}-${year}`
}