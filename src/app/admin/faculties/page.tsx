"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { adminService } from "@/services/supabase-admin-service";

export default function AdminFacultiesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [faculties, setFaculties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadFaculties() {
      setLoading(true);
      const data = await adminService.getFaculties();
      if (data) {
        setFaculties(data);
      }
      setLoading(false);
    }
    loadFaculties();
  }, []);

  const filteredFaculties = React.useMemo(() => {
    return faculties.filter((f) =>
      !searchQuery ||
      f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faculties, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <PageHeader
        title="University Faculties"
        description="Manage academic faculties, associated departments, and faculty dean assignments from Supabase database."
        actions={
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 gap-1.5 shrink-0">
            <Link href="/admin/departments/new">
              <Plus className="h-4 w-4" /> Add Department
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search faculties by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs h-9"
        />
      </div>

      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Faculty Name & Code</th>
              <th className="p-4">Child Departments</th>
              <th className="p-4">Total Records</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-xs text-muted-foreground">
                  Loading faculties and department counts from database...
                </td>
              </tr>
            ) : filteredFaculties.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-xs text-muted-foreground">
                  No faculties found.
                </td>
              </tr>
            ) : (
              filteredFaculties.map((f) => (
                <tr key={f.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-bold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>{f.name}</span>
                    <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded">{f.code}</span>
                  </td>
                  <td className="p-4 font-semibold text-foreground">{f.departmentsCount || 0} departments</td>
                  <td className="p-4 text-muted-foreground">{f.recordsCount || 0} records</td>
                  <td className="p-4 text-right">
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs font-semibold px-2.5">
                      <Link href="/admin/departments">View Departments</Link>
                    </Button>
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
