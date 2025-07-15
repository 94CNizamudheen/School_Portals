

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import type { Parent } from "../../store/parentSlice";
import type {Student} from '../../types/student' 

interface Props {
  open: boolean;
  onClose: () => void;
  onAssign: (selectedIds: string[]) => void;
  students: Student[];
  parent: Parent;
}

export const AssignChildrenModal: React.FC<Props> = ({ open, onClose, onAssign, students, parent }) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredStudents = students.filter((s) =>
    s.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setSelectedIds([]);
    setSearch("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Students to {parent.name}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto mt-3 space-y-2">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <div
                key={s._id}
                className={`flex justify-between items-center px-3 py-2 rounded border ${
                  selectedIds.includes(s._id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <span>{s.firstName}</span>
                <Button
                  variant={selectedIds.includes(s._id) ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleSelect(s._id)}
                >
                  {selectedIds.includes(s._id) ? "Remove" : "Select"}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-2">No students found.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onAssign(selectedIds)} disabled={selectedIds.length === 0}>
            Assign ({selectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
