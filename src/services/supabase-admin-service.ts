import { createBrowserClient } from "@/lib/supabase/client";
import { mapRowToRecord } from "@/services/supabase-repository-service";
import { RepositoryRecord, RecordStatus } from "@/types/repository";
import { CreateRepositoryRecordInput } from "@/lib/validation/repository";
import { CreateDepartmentInput } from "@/lib/validation/department";
import { HTU_FACULTIES, HTU_DEPARTMENTS, HTU_CATEGORIES } from "@/lib/constants/faculties-departments";

export interface AdminStats {
  totalRecords: number;
  pendingApprovals: number;
  totalUsers: number;
  totalViews: number;
}

export class SupabaseAdminService {
  private client = createBrowserClient();

  async getAdminStats(): Promise<AdminStats> {
    let stats: AdminStats | null = null;

    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.stats) stats = json.stats;
        }
      } catch (err) {
        console.warn("[supabase-admin-service] /api/admin/stats fetch failed, attempting client fallback", err);
      }
    }

    if (!stats) {
      try {
        const { count: totalRecords } = await this.client
          .from("repository_records")
          .select("id", { count: "exact" });

        const { count: pendingApprovals } = await this.client
          .from("repository_records")
          .select("id", { count: "exact" })
          .in("status", ["PENDING_HOD", "PENDING_DEAN", "PENDING_REVIEW", "PENDING", "SUBMITTED", "DRAFT"]);

        let usersCount = 0;
        try {
          const { count } = await this.client
            .from("profiles")
            .select("id", { count: "exact" });
          usersCount = count || 0;
        } catch {}

        const { data: viewsData } = await this.client
          .from("repository_records")
          .select("views_count");

        const totalViews = viewsData ? viewsData.reduce((acc, curr) => acc + (curr.views_count || 0), 0) : 0;

        stats = {
          totalRecords: totalRecords || 0,
          pendingApprovals: pendingApprovals || 0,
          totalUsers: usersCount,
          totalViews: totalViews || 0,
        };
      } catch {
        stats = { totalRecords: 0, pendingApprovals: 0, totalUsers: 0, totalViews: 0 };
      }
    }

    return stats;
  }

  async getAllRecords(): Promise<RepositoryRecord[]> {
    let records: RepositoryRecord[] = [];
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/records", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.records) records = json.records.map(mapRowToRecord);
        }
      } catch (err) {
        console.warn("[supabase-admin-service] /api/admin/records fetch failed, attempting client fallback", err);
      }
    }

    if (records.length === 0) {
      try {
        const { data, error } = await this.client
          .from("repository_records")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          records = data.map(mapRowToRecord);
        }
      } catch {}
    }

    return records;
  }

  async getPendingApprovals(): Promise<RepositoryRecord[]> {
    let records: RepositoryRecord[] = [];
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/records?pending=true");
        if (res.ok) {
          const json = await res.json();
          if (json.records) records = json.records.map(mapRowToRecord);
        }
      } catch (err) {
        console.warn("[supabase-admin-service] /api/admin/records?pending=true fetch failed, attempting client fallback", err);
      }
    }

    if (records.length === 0) {
      try {
        const { data, error } = await this.client
          .from("repository_records")
          .select("*")
          .in("status", ["PENDING_HOD", "PENDING_DEAN", "PENDING_REVIEW", "PENDING", "SUBMITTED", "DRAFT"])
          .order("created_at", { ascending: false });

        if (!error && data) {
          records = data.map(mapRowToRecord);
        }
      } catch {}
    }

    return records;
  }

  async getRecordById(id: string): Promise<RepositoryRecord | null> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/admin/records/${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.record) return mapRowToRecord(json.record);
        }
      } catch (err) {
        console.warn("[supabase-admin-service] /api/admin/records/[id] GET failed, attempting client fallback", err);
      }
    }

    try {
      const { data, error } = await this.client
        .from("repository_records")
        .select("*, faculties(name), departments(name), categories(name)")
        .eq("id", id)
        .single();

      if (!error && data) {
        return mapRowToRecord(data);
      }
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const localList: RepositoryRecord[] = JSON.parse(stored);
          const found = localList.find((r) => r.id === id);
          if (found) return found;
        }
      } catch {}
    }

    return null;
  }

  async createRecord(input: CreateRepositoryRecordInput): Promise<RepositoryRecord | null> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.record) {
            return mapRowToRecord(json.record);
          }
        }
      } catch (err) {
        console.warn("[supabase-admin-service] /api/records fetch failed, attempting client insert fallback", err);
      }
    }

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
      group_members: input.groupMembers || [],
      file_url: input.fileUrl || null,
      file_name: input.fileName || null,
      file_size: input.fileSize || null,
      mime_type: input.mimeType || null,
    };

    if (input.status === "PUBLISHED") {
      rowData.published_at = new Date().toISOString();
    }

    try {
      const { data, error } = await this.client
        .from("repository_records")
        .insert(rowData)
        .select("*, faculties(name), departments(name), categories(name)")
        .single();

      if (!error && data) {
        return mapRowToRecord(data);
      }
      if (error) {
        console.error("[supabase-admin-service] createRecord error:", error.message, error.details, error);
      }
    } catch (err) {
      console.warn("[supabase-admin-service] client insert exception", err);
    }

    // Local / Offline / Fallback mode support when database is unconfigured or unreachable
    const now = new Date().toISOString();
    const facultyName = HTU_FACULTIES.find((f) => f.id === input.facultyId)?.name || input.facultyId?.toUpperCase();
    const departmentName = HTU_DEPARTMENTS.find((d) => d.id === input.departmentId)?.name || input.departmentId?.toUpperCase();
    const categoryName = HTU_CATEGORIES.find((c) => c.id === input.categoryId)?.name || input.categoryId?.toUpperCase();

    const fallbackRecord: RepositoryRecord = {
      id: `rec-local-${Date.now()}`,
      title: input.title,
      slug,
      recordType: input.recordType,
      status: input.status,
      abstract: input.abstract,
      studentName: input.studentName,
      studentId: input.studentId,
      groupMembers: input.groupMembers || [],
      supervisorName: input.supervisorName,
      academicYear: input.academicYear || 2026,
      facultyId: input.facultyId,
      facultyName,
      departmentId: input.departmentId,
      departmentName,
      categoryId: input.categoryId,
      categoryName,
      keywords: input.keywords || [],
      fileUrl: input.fileUrl,
      fileName: input.fileName,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem("local_user_submissions", JSON.stringify([fallbackRecord, ...list]));
      } catch (e) {
        console.error("Failed to save local submission fallback", e);
      }
    }

    return fallbackRecord;
  }

  async updateRecordStatus(id: string, status: RecordStatus): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/records/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("local_user_submissions");
            if (stored) {
              const list: RepositoryRecord[] = JSON.parse(stored);
              const idx = list.findIndex((r) => r.id === id);
              if (idx !== -1) {
                list[idx].status = status;
                if (status === "PUBLISHED" || status === "APPROVED") {
                  list[idx].publishedAt = new Date().toISOString();
                }
                localStorage.setItem("local_user_submissions", JSON.stringify(list));
              }
            }
          } catch {}
        }
        return true;
      }
    } catch (err) {
      console.warn("[supabase-admin-service] /api/admin/records/[id] PATCH failed, attempting client fallback", err);
    }

    const updateData: any = { status };
    if (status === "PUBLISHED" || status === "APPROVED") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await this.client
      .from("repository_records")
      .update(updateData)
      .eq("id", id);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const list: RepositoryRecord[] = JSON.parse(stored);
          const idx = list.findIndex((r) => r.id === id);
          if (idx !== -1) {
            list[idx].status = status;
            if (status === "PUBLISHED" || status === "APPROVED") {
              list[idx].publishedAt = new Date().toISOString();
            }
            localStorage.setItem("local_user_submissions", JSON.stringify(list));
          }
        }
      } catch {}
    }

    return !error;
  }

  async deleteRecord(id: string): Promise<boolean> {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const list: RepositoryRecord[] = JSON.parse(stored);
          const filtered = list.filter((r) => r.id !== id);
          localStorage.setItem("local_user_submissions", JSON.stringify(filtered));
        }
      } catch {}
    }

    try {
      const res = await fetch(`/api/admin/records/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) return true;
    } catch {}

    const { error } = await this.client
      .from("repository_records")
      .delete()
      .eq("id", id);

    return !error;
  }

  clearLocalSubmissions(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("local_user_submissions");
      } catch {}
    }
  }

  async clearAllRecords(): Promise<boolean> {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("local_user_submissions");
      } catch {}
    }

    try {
      const res = await fetch("/api/admin/records", { method: "DELETE" });
      if (res.ok) return true;
    } catch {}

    const { error } = await this.client
      .from("repository_records")
      .delete()
      .neq("id", "");

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
      const res = await fetch("/api/admin/users", { cache: "no-store" });
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
