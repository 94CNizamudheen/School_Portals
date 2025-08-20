import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "../ui/input";
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
  "/admin/teachers": [
    { value: "all", label: "All Teachers" },
    { value: "maths", label: "Maths" },
    { value: "social", label: "Social" },
    { value: "science", label: "Science" },
  ],
  "/admin/classes": [
    { value: "all", label: "All Classes" },
    { value: "LKG", label: "LKG" },
    { value: "UKG", label: "UKG" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
  ],
  "/admin/subjects": [
  { value: "all", label: "All Subjects" },
  { value: "Core", label: "Core" },
  { value: "Language", label: "Language" },
  { value: "Elective", label: "Elective" },
],
};

interface Props {
  onFilterChange: (value: string) => void;
  onSearchChange: (query: string) => void;
}

const StatusFilterWithSearch = ({ onFilterChange, onSearchChange }: Props) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const currentPath = location.pathname;
  const options = filterOptions[currentPath] || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearchChange(val);
  };

  const handleFilterClick = (value: string) => {
    setFilterValue(value);
    onFilterChange(value);
  };

  return (
  <div className="max-w-7xl mx-auto px-4 py-4">
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50">
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
      
      {/* Search Bar - full width on small screens */}
      <div className="relative w-full md:flex-1 md:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearch}
          className="w-full text-gray-600 pl-10 pr-4 py-2 md:py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white/50"
        />
      </div>

      {/* Filter buttons - scrollable on mobile */}
      <div className="w-full md:w-auto overflow-x-auto">
        <div className="flex gap-2 min-w-max md:flex-wrap justify-start md:justify-center pb-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterClick(opt.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                filterValue === opt.value
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white/50 text-gray-600 hover:bg-white/80 hover:text-gray-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default StatusFilterWithSearch;
