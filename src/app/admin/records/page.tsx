"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RepositoryRecord } from "@/types/repository";
import { adminService } from "@/services/supabase-admin-service";

export default function AdminRecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [records, setRecords] = React.useState<RepositoryRecord[]>([]);

  React.useEffect(() => {
    async function loadRecords() {
      const data = await adminService.getAllRecords();
      if (data && data.length > 0) {
        setRecords(data);
      }
    }
    loadRecords();
  }, []);

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.supervisorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Are you sure you want to delete this repository record?")) {
      await adminService.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card with Action Button inside */}
      <PageHeader
        title="Repository Records Management"
        description="View, filter, manage, and edit all student project and thesis submissions from Supabase database."
        actions={
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shrink-0 h-9"
          >
            <Link href="/admin/records/new">
              <Plus className="h-4 w-4" /> Add Record
            </Link>
          </Button>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title, student, or supervisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="PENDING_HOD">Pending HOD</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Title & Type</th>
              <th className="p-4">Student & Supervisor</th>
              <th className="p-4">Faculty & Department</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-xs text-muted-foreground">
                  No repository records found matching search filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-medium max-w-xs">
                    <div className="font-bold text-foreground line-clamp-1">{r.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {r.recordType}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{r.academicYear}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-foreground">{r.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">Sup: {r.supervisorName}</div>
                  </td>

                  <td className="p-4">
                    <div className="text-foreground">{r.departmentName || "Department"}</div>
                    <div className="text-[11px] text-muted-foreground">{r.facultyName || "Faculty"}</div>
                  </td>

                  <td className="p-4">
                    {r.status === "PUBLISHED" && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                        Published
                      </Badge>
                    )}
                    {r.status === "PENDING_HOD" && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                        Pending HOD
                      </Badge>
                    )}
                    {r.status === "DRAFT" && (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        Draft
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
                      <DropdownMenuContent align="end" className="w-44 p-1.5 space-y-1 shadow-lg border border-border bg-card">
                        <DropdownMenuItem className="p-0">
                          <Link href={`/admin/records/${r.id}`} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors w-full">
                            <Eye className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="p-0">
                          <Link href={`/admin/records/${r.id}/edit`} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors w-full">
                            <Edit className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                            <span>Edit Record</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDeleteRecord(r.id)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive rounded-md cursor-pointer hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive shrink-0" />
                          <span>Delete Record</span>
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
    </div>
  );
}
