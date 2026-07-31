export interface FacultyReportItem {
  facultyId: string;
  facultyName: string;
  count: number;
}

export interface YearReportItem {
  year: number;
  count: number;
}

export interface ReportSummary {
  totalRecords: number;
  totalProjects: number;
  totalTheses: number;
  totalUsers: number;
  totalDownloads: number;
  recordsByFaculty: FacultyReportItem[];
  recordsByYear: YearReportItem[];
}
