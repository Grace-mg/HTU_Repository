import { ReportSummary } from "@/types/reports";
import { RepositoryFilters } from "@/types/repository";

export interface ReportService {
  getReportSummary(): Promise<ReportSummary>;
  exportRecordsData(filters: RepositoryFilters, format: "csv" | "json"): Promise<Blob | string>;
}
