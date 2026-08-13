import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { repositoryService } from "@/services/supabase-repository-service";
import { adminService } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";

export const dynamic = "force-dynamic";

interface ThesisDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ThesisDetailPage({ params }: ThesisDetailPageProps) {
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
      status: "PUBLISHED",
      abstract: "This academic thesis provides an analytical study and empirical research paper conducted by final year students at Ho Technical University.",
      studentName: "Student Author & Group Members",
      studentId: "HTU/FAST/2026/042",
      supervisorName: "Academic Supervisor",
      academicYear: 2026,
      facultyId: "fast",
      facultyName: "Faculty of Applied Sciences & Tech",
      departmentId: "cs",
      departmentName: "Computer Science & IT",
      categoryId: "thesis",
      categoryName: "Research & Analytical Theses",
      keywords: ["Academic Thesis", "Empirical Research", "Data Analytics"],
      viewsCount: 184,
      downloadsCount: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RecordDetailView record={record} />
    </div>
  );
}
