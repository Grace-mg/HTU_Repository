"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminService } from "@/services/supabase-admin-service";
import { HTU_FACULTIES } from "@/lib/constants/faculties-departments";

export default function AdminDepartmentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [facultyFilter, setFacultyFilter] = React.useState("all");
  const [departments, setDepartments] = React.useState<any[]>([]);

  // Delete modal confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedDeptForDelete, setSelectedDeptForDelete] = React.useState<any | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    async function loadDepts() {
      const data = await adminService.getDepartments();
      setDepartments(data || []);
    }
    loadDepts();
  }, []);

  const filteredDepartments = React.useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        !searchQuery ||
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.hod_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFaculty = facultyFilter === "all" || d.faculty_id === facultyFilter;

      return matchesSearch && matchesFaculty;
    });
  }, [departments, searchQuery, facultyFilter]);

  const toggleStatus = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  const handleOpenDeleteModal = (dept: any) => {
    setSelectedDeptForDelete(dept);
    setDeleteConfirmationText("");
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeptForDelete || deleteConfirmationText !== "DELETE") return;

    setIsDeleting(true);
    const success = await adminService.deleteDepartment(selectedDeptForDelete.id);
    setIsDeleting(false);

    if (success) {
      setDepartments((prev) => prev.filter((d) => d.id !== selectedDeptForDelete.id));
    }
    setDeleteModalOpen(false);
    setSelectedDeptForDelete(null);
    setDeleteConfirmationText("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <PageHeader
        title="Department & Faculty Management"
        description="Manage academic departments, faculties, and assigned Heads of Department (HODs) from Supabase database."
        actions={
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shrink-0 h-9"
          >
            <Link href="/admin/departments/new">
              <Plus className="h-4 w-4" /> Add Department
            </Link>
          </Button>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by department name, code, or HOD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Select value={facultyFilter} onValueChange={setFacultyFilter}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Faculties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            {HTU_FACULTIES.map((fac) => (
              <SelectItem key={fac.id} value={fac.id}>
                {fac.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Free-Flowing Departments Table */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Department Name & Code</th>
              <th className="p-4">Associated Faculty</th>
              <th className="p-4">Assigned HOD</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-xs text-muted-foreground">
                  No departments created yet. Click &quot;Add Department&quot; to register your first department.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((d) => (
                <tr key={d.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-medium">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>{d.name}</span>
                      <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded">{d.code}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium">{d.faculties?.name || d.faculty_id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{d.hod_name || "Unassigned"}</div>
                    <div className="text-[11px] text-muted-foreground">{d.hod_email || "N/A"}</div>
                  </td>
                  <td className="p-4">
                    {d.is_active !== false ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      {/* Clean Single-Line Dropdown Layout */}
                      <DropdownMenuContent align="end" className="w-56 p-1.5 space-y-1 shadow-lg border border-border bg-card">
                        <DropdownMenuItem className="p-0">
                          <Link href={`/admin/departments/${d.id}/edit`} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors w-full">
                            <Edit className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>Edit Department / HOD</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => toggleStatus(d.id)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors"
                        >
                          <Power className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>{d.is_active !== false ? "Deactivate Department" : "Activate Department"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 border-border" />

                        <DropdownMenuItem
                          onClick={() => handleOpenDeleteModal(d)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive rounded-md cursor-pointer hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive shrink-0" />
                          <span>Delete Department</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Department Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Confirm Department Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              This action will permanently delete <strong className="text-foreground">{selectedDeptForDelete?.name}</strong> ({selectedDeptForDelete?.code}) from the database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-md border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 leading-relaxed">
              To confirm deletion, please type <strong className="font-mono text-destructive uppercase">DELETE</strong> in the box below.
            </div>

            <Input
              placeholder="Type DELETE to confirm..."
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="text-xs font-mono h-9 uppercase"
            />
          </div>

          <DialogFooter className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteConfirmationText !== "DELETE" || isDeleting}
              onClick={handleConfirmDelete}
              className="text-xs font-semibold px-4"
            >
              {isDeleting ? "Deleting..." : "Delete Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
