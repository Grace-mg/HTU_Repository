import { createBrowserClient } from "@/lib/supabase/client";
import { RepositoryRecord, RepositoryFilters, RecordType, RecordStatus } from "@/types/repository";

export function mapRowToRecord(row: any): RepositoryRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    recordType: row.record_type as RecordType,
    status: row.status as RecordStatus,
    abstract: row.abstract,
    studentName: row.student_name,
    studentId: row.student_id || undefined,
    groupMembers: Array.isArray(row.group_members)
      ? row.group_members
      : typeof row.group_members === "string"
      ? JSON.parse(row.group_members)
      : [],
    supervisorName: row.supervisor_name,
    academicYear: row.academic_year,
    facultyId: row.faculty_id,
    facultyName: row.faculties?.name || row.faculty_name,
    departmentId: row.department_id,
    departmentName: row.departments?.name || row.department_name,
    categoryId: row.category_id,
    categoryName: row.categories?.name || row.category_name,
    keywords: row.keywords || [],
    fileUrl: row.file_url || undefined,
    fileName: row.file_name || undefined,
    fileSize: row.file_size || undefined,
    mimeType: row.mime_type || undefined,
    viewsCount: row.views_count || 0,
    downloadsCount: row.downloads_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
  };
}

export class SupabaseRepositoryService {
  private client = createBrowserClient();

  async getRecords(filters: RepositoryFilters = {}): Promise<{ records: RepositoryRecord[]; total: number }> {
    let query = this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)", { count: "exact" });

    if (filters.query) {
      const q = filters.query.trim();
      if (q) {
        query = query.or(
          `title.ilike.%${q}%,abstract.ilike.%${q}%,student_name.ilike.%${q}%,supervisor_name.ilike.%${q}%`
        );
      }
    }

    if (filters.keyword) {
      query = query.contains("keywords", [filters.keyword]);
    }

    if (filters.recordType) {
      query = query.eq("record_type", filters.recordType);
    }

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    } else if (filters.status !== "all") {
      // Default to PUBLISHED and APPROVED records for public queries
      query = query.in("status", ["PUBLISHED", "APPROVED"]);
    }

    if (filters.facultyId) {
      query = query.eq("faculty_id", filters.facultyId);
    }

    if (filters.departmentId) {
      query = query.eq("department_id", filters.departmentId);
    }

    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }

    if (filters.academicYear) {
      query = query.eq("academic_year", filters.academicYear);
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Apply dynamic sorting options
    const sortBy = filters.sortBy || "newest";
    if (sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "title_asc") {
      query = query.order("title", { ascending: true });
    } else if (sortBy === "title_desc") {
      query = query.order("title", { ascending: false });
    } else if (sortBy === "views") {
      query = query.order("views_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    let records: RepositoryRecord[] = [];
    if (!error && data) {
      records = data.map(mapRowToRecord);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const localList: RepositoryRecord[] = JSON.parse(stored);
          const targetStatus = filters.status || ["PUBLISHED", "APPROVED"];
          const matchingLocals = localList.filter((r) => {
            if (Array.isArray(targetStatus)) {
              return targetStatus.includes(r.status);
            }
            return r.status === targetStatus;
          });
          const existingIds = new Set(records.map((r) => r.id));
          const newLocals = matchingLocals.filter((l) => !existingIds.has(l.id));
          records = [...newLocals, ...records];
        }
      } catch {}
    }

    return {
      records,
      total: records.length,
    };
  }

  async getRecordBySlug(slug: string): Promise<RepositoryRecord | null> {
    try {
      const { data, error } = await this.client
        .from("repository_records")
        .select("*, faculties(name), departments(name), categories(name)")
        .eq("slug", slug)
        .single();

      if (!error && data) return mapRowToRecord(data);
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const localList: RepositoryRecord[] = JSON.parse(stored);
          const found = localList.find((r) => r.slug === slug);
          if (found) return found;
        }
      } catch {}
    }

    return null;
  }

  async getRecordById(id: string): Promise<RepositoryRecord | null> {
    try {
      const { data, error } = await this.client
        .from("repository_records")
        .select("*, faculties(name), departments(name), categories(name)")
        .eq("id", id)
        .single();

      if (!error && data) return mapRowToRecord(data);
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

  async incrementViews(id: string): Promise<void> {
    try {
      const { data } = await this.client.from("repository_records").select("views_count").eq("id", id).single();
      if (data) {
        await this.client.from("repository_records").update({ views_count: (data.views_count || 0) + 1 }).eq("id", id);
      }
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const list: RepositoryRecord[] = JSON.parse(stored);
          const updated = list.map((r) =>
            r.id === id ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r
          );
          localStorage.setItem("local_user_submissions", JSON.stringify(updated));
        }
      } catch {}
    }
  }

  async incrementDownloads(id: string): Promise<void> {
    try {
      const { data } = await this.client.from("repository_records").select("downloads_count").eq("id", id).single();
      if (data) {
        await this.client.from("repository_records").update({ downloads_count: (data.downloads_count || 0) + 1 }).eq("id", id);
      }
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("local_user_submissions");
        if (stored) {
          const list: RepositoryRecord[] = JSON.parse(stored);
          const updated = list.map((r) =>
            r.id === id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r
          );
          localStorage.setItem("local_user_submissions", JSON.stringify(updated));
        }
      } catch {}
    }
  }

  async getTopRecords(limit: number = 5): Promise<RepositoryRecord[]> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .in("status", ["PUBLISHED", "APPROVED"])
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map(mapRowToRecord);
  }

  async getAnalyticsSummary(): Promise<{
    totalRecords: number;
    totalViews: number;
    totalDownloads: number;
    publishedProjects: number;
    publishedTheses: number;
  }> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("record_type, views_count, downloads_count, status");

    if (error || !data) {
      return {
        totalRecords: 0,
        totalViews: 0,
        totalDownloads: 0,
        publishedProjects: 0,
        publishedTheses: 0,
      };
    }

    const totalRecords = data.length;
    const totalViews = data.reduce((acc, row) => acc + (row.views_count || 0), 0);
    const totalDownloads = data.reduce((acc, row) => acc + (row.downloads_count || 0), 0);
    const publishedProjects = data.filter(
      (r) => r.record_type === "PROJECT" && (r.status === "PUBLISHED" || r.status === "APPROVED")
    ).length;
    const publishedTheses = data.filter(
      (r) => r.record_type === "THESIS" && (r.status === "PUBLISHED" || r.status === "APPROVED")
    ).length;

    return {
      totalRecords,
      totalViews,
      totalDownloads,
      publishedProjects,
      publishedTheses,
    };
  }
}

export const repositoryService = new SupabaseRepositoryService();
