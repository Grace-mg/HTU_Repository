import { createBrowserClient } from "@/lib/supabase/client";
import { mapRowToRecord } from "@/services/supabase-repository-service";
import { RepositoryRecord, RecordStatus } from "@/types/repository";
import { CreateRepositoryRecordInput } from "@/lib/validation/repository";
import { CreateDepartmentInput } from "@/lib/validation/department";

export interface AdminStats {
  totalRecords: number;
  pendingApprovals: number;
  totalUsers: number;
  totalViews: number;
}

export class SupabaseAdminService {
  private client = createBrowserClient();

  async getAdminStats(): Promise<AdminStats> {
    try {
      const { count: totalRecords } = await this.client
        .from("repository_records")
        .select("*", { count: "exact", head: true });

      const { count: pendingApprovals } = await this.client
        .from("repository_records")
        .select("*", { count: "exact", head: true })
        .in("status", ["PENDING_HOD", "PENDING_DEAN"]);

      const { count: totalUsers } = await this.client
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { data: viewsData } = await this.client
        .from("repository_records")
        .select("views_count");

      const totalViews = viewsData ? viewsData.reduce((acc, curr) => acc + (curr.views_count || 0), 0) : 0;

      return {
        totalRecords: totalRecords || 0,
        pendingApprovals: pendingApprovals || 0,
        totalUsers: totalUsers || 0,
        totalViews: totalViews || 0,
      };
    } catch {
      return { totalRecords: 0, pendingApprovals: 0, totalUsers: 0, totalViews: 0 };
    }
  }

  async getAllRecords(): Promise<RepositoryRecord[]> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(mapRowToRecord);
  }

  async getPendingApprovals(): Promise<RepositoryRecord[]> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .in("status", ["PENDING_HOD", "PENDING_DEAN"])
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(mapRowToRecord);
  }

  async createRecord(input: CreateRepositoryRecordInput): Promise<RepositoryRecord | null> {
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const rowData: any = {
      title: input.title,
      slug,
      record_type: input.recordType,
      status: input.status,
      abstract: input.abstract,
      student_name: input.studentName,
      student_id: input.studentId || null,
      supervisor_name: input.supervisorName,
      academic_year: input.academicYear || 2026,
      faculty_id: input.facultyId || null,
      department_id: input.departmentId || null,
      category_id: input.categoryId || null,
      keywords: input.keywords || [],
    };

    if (input.status === "PUBLISHED") {
      rowData.published_at = new Date().toISOString();
    }

    const { data, error } = await this.client
      .from("repository_records")
      .insert(rowData)
      .select("*, faculties(name), departments(name), categories(name)")
      .single();

    if (error || !data) return null;
    return mapRowToRecord(data);
  }

  async updateRecordStatus(id: string, status: RecordStatus): Promise<boolean> {
    const updateData: any = { status };
    if (status === "PUBLISHED") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await this.client
      .from("repository_records")
      .update(updateData)
      .eq("id", id);

    return !error;
  }

  async getFaculties(): Promise<any[]> {
    const { data: facultiesData } = await this.client
      .from("faculties")
      .select("*")
      .order("name");

    if (!facultiesData) return [];

    const { data: deptsData } = await this.client
      .from("departments")
      .select("id, faculty_id");

    const { data: recordsData } = await this.client
      .from("repository_records")
      .select("id, faculty_id");

    const deptCountsMap: Record<string, number> = {};
    if (deptsData) {
      deptsData.forEach((d) => {
        if (d.faculty_id) {
          deptCountsMap[d.faculty_id] = (deptCountsMap[d.faculty_id] || 0) + 1;
        }
      });
    }

    const recordCountsMap: Record<string, number> = {};
    if (recordsData) {
      recordsData.forEach((r) => {
        if (r.faculty_id) {
          recordCountsMap[r.faculty_id] = (recordCountsMap[r.faculty_id] || 0) + 1;
        }
      });
    }

    return facultiesData.map((f: any) => ({
      id: f.id,
      name: f.name,
      code: f.code,
      departmentsCount: deptCountsMap[f.id] || 0,
      recordsCount: recordCountsMap[f.id] || 0,
    }));
  }

  async getDepartments(): Promise<any[]> {
    const { data, error } = await this.client
      .from("departments")
      .select("*, faculties(name)")
      .order("name");

    if (error || !data) return [];
    return data;
  }

  async createDepartment(input: CreateDepartmentInput): Promise<any | null> {
    try {
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const json = await res.json();
        return json.department || true;
      }

      // Fallback direct insert via browser client
      const rowData: any = {
        id: input.code.toLowerCase(),
        name: input.name,
        code: input.code,
        faculty_id: input.facultyId,
        hod_name: input.hodName || null,
        hod_email: input.hodEmail || null,
        is_active: input.isActive !== false,
      };

      const { data, error } = await this.client
        .from("departments")
        .insert(rowData)
        .select("*, faculties(name)")
        .single();

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.error("[createDepartment Error]", err);
      return null;
    }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/departments/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        return true;
      }

      // Fallback direct delete via browser client
      const { error } = await this.client
        .from("departments")
        .delete()
        .eq("id", id);

      return !error;
    } catch (err) {
      console.error("[deleteDepartment Error]", err);
      return false;
    }
  }

  async getCategories(): Promise<any[]> {
    const { data, error } = await this.client
      .from("categories")
      .select("*")
      .order("name");

    if (error || !data) return [];
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      recordCount: 0,
    }));
  }

  async getUsers(): Promise<any[]> {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        if (json.users) return json.users;
      }

      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data;
    } catch (err) {
      console.error("[getUsers Error]", err);
      return [];
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("[deleteUser Error]", err);
      return false;
    }
  }

  async toggleSuspendUser(id: string, isSuspended: boolean): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_suspended: isSuspended }),
      });
      return res.ok;
    } catch (err) {
      console.error("[toggleSuspendUser Error]", err);
      return false;
    }
  }
}

export const adminService = new SupabaseAdminService();
