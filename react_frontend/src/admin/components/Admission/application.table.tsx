

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Eye } from "lucide-react"
import { StatusBadge } from "./stats.badge"
import { formatDate } from "../../../utils/admission.utils"
import type { AdmissionFormData } from "../../../types/admission.types"

interface ApplicationsTableProps {
  admissions: AdmissionFormData[]
  totalCount: number
  onViewDetails: (admission: AdmissionFormData) => void
}

export function ApplicationsTable({ admissions, totalCount, onViewDetails }: ApplicationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admission Applications</CardTitle>
        <CardDescription>
          {admissions.length} of {totalCount} applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Class Applied</TableHead>
              <TableHead>Parent Contact</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.map((admission) => (
              <TableRow key={admission._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {admission.firstName} {admission.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{admission.email}</div>
                  </div>
                </TableCell>
                <TableCell>{admission.classApplied}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{admission.parentName}</div>
                    <div className="text-sm text-muted-foreground">{admission.mobileNumber}</div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(admission.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={admission.status.toLowerCase() as AdmissionFormData['status']} />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(admission)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {admissions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No admission applications found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
