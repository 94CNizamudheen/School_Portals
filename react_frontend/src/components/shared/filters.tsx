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
    { value: "all", label: "All" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Uncle", label: "Uncle" },
    { value: "Aunt", label: "Aunt" },
    { value: "Grandmother", label: "Grandmother" },
    { value: "Grandfather", label: "Grandfather" },
    { value: "Guardian", label: "Guardian" },
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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* Search Bar - Left side */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full text-gray-600 pl-10 pr-4 py-2 rounded-xl border border-gray-300/60 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>

          {/* Filter buttons - Right side */}
          <div className="flex items-center gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFilterClick(opt.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                  filterValue === opt.value
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white/60 text-gray-700 hover:bg-white/90 hover:text-gray-900 border border-gray-200/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          
          {/* Search Bar - Full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full text-gray-600 pl-10 pr-4 py-3 rounded-xl border border-gray-300/60 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>

          {/* Filter buttons - Scrollable horizontal on mobile */}
          <div className="w-full overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterClick(opt.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                    filterValue === opt.value
                      ? "bg-gray-800 text-white shadow-md"
                      : "bg-white/60 text-gray-700 hover:bg-white/90 hover:text-gray-900 border border-gray-200/50"
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