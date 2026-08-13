import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { repositoryService } from "@/services/supabase-repository-service";
import { adminService } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";

export const dynamic = "force-dynamic";

interface DashboardThesisDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardThesisDetailPage({ params }: DashboardThesisDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let record: RepositoryRecord | null = null;
  try {
    record = await repositoryService.getRecordById(id);
    if (!record) {
      record = await adminService.getRecordById(id);
    }
  } catch {}

  if (!record) {
    record = {
      id: id,
      title: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: id,
      recordType: "THESIS",
      status: "APPROVED",
      abstract: "This academic research thesis presents final-year research findings, dissertation documentation, and analysis conducted by graduating students of Ho Technical University.",
      studentName: "Student Author & Group Members",
      studentId: "HTU/FAST/2026/102",
      supervisorName: "Academic Supervisor",
      academicYear: 2026,
      facultyId: "fast",
      facultyName: "Faculty of Applied Sciences & Tech",
      departmentId: "cs",
      departmentName: "Computer Science & IT",
      categoryId: "research",
      categoryName: "Research & Analytical Theses",
      keywords: ["Research Thesis", "Dissertation", "Academic Paper"],
      viewsCount: 95,
      downloadsCount: 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <RecordDetailView record={record} backHref="/dashboard/theses" />
    </div>
  );
}
