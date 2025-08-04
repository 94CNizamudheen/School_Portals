import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "../ui/input";
import {Select,SelectTrigger,SelectContent,  SelectItem,SelectValue,} from "../ui/select";
import { Search } from "lucide-react";

const filterOptions: Record<string, { label: string; value: string }[]> = {
  "/admin/admission": [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],
  "/admin/parents": [
    { value: "all", label: "All Parents" },
    { value: "Father", label: "Relation Father" },
    { value: "Mother", label: "Relation Mother" },
    { value: "Uncle", label: "Relation Uncle" },
    { value: "Aunt", label: "Relation Aunt" },
    { value: "Grandmother", label: "Relation Grandmother" },
    { value: "Grandfather", label: "Relation Grandfather" },
    { value: "Guardian", label: "Relation Guardian" },
    { value: "Other", label: "Other" },
  ],
  "/admin/students": [
    { value: "all", label: "All Students" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  '/admin/teachers':[
    {value:'all',label:"All Teachers"},
    {value:'maths',label:"Maths"},
    {value:'social',label:"Social"},
    {value:'science',label:"Science"},
  ]
};

interface Props {
  onFilterChange: (value: string) => void;
  onSearchChange: (query: string) => void;
}

const StatusFilterWithSearch=({ onFilterChange, onSearchChange }: Props)=> {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const currentPath = location.pathname;
  const options = filterOptions[currentPath] || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearchChange(val);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 ">
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearch}
          className="pl-9"
        />
      </div>
    </div>
  );
}
export default StatusFilterWithSearch