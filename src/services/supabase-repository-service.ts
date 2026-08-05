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
      query = query.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,student_name.ilike.%${filters.query}%`);
    }

    if (filters.recordType) {
      query = query.eq("record_type", filters.recordType);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    } else {
      // Default to PUBLISHED records for public queries unless explicitly overridden
      query = query.eq("status", "PUBLISHED");
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

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      return { records: [], total: 0 };
    }

    return {
      records: data.map(mapRowToRecord),
      total: count || data.length,
    };
  }

  async getRecordBySlug(slug: string): Promise<RepositoryRecord | null> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return mapRowToRecord(data);
  }

  async getRecordById(id: string): Promise<RepositoryRecord | null> {
    const { data, error } = await this.client
      .from("repository_records")
      .select("*, faculties(name), departments(name), categories(name)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapRowToRecord(data);
  }

  async incrementViews(id: string): Promise<void> {
    const { data } = await this.client.from("repository_records").select("views_count").eq("id", id).single();
    if (data) {
      await this.client.from("repository_records").update({ views_count: (data.views_count || 0) + 1 }).eq("id", id);
    }
  }

  async incrementDownloads(id: string): Promise<void> {
    const { data } = await this.client.from("repository_records").select("downloads_count").eq("id", id).single();
    if (data) {
      await this.client.from("repository_records").update({ downloads_count: (data.downloads_count || 0) + 1 }).eq("id", id);
    }
  }
}

export const repositoryService = new SupabaseRepositoryService();
