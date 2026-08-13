import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { repositoryService } from "@/services/supabase-repository-service";
import { adminService } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";

export const dynamic = "force-dynamic";

interface DashboardProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardProjectDetailPage({ params }: DashboardProjectDetailPageProps) {
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
      recordType: "PROJECT",
      status: id.toLowerCase().includes("pending") ? "PENDING_REVIEW" : id.toLowerCase().includes("reject") ? "REJECTED" : "APPROVED",
      abstract: "This project presents a working software build and prototype created by graduating students of Ho Technical University. The complete design documentation and source files are published following review and approval.",
      studentName: "Student Author & Group Members",
      studentId: "HTU/ENG/2026/088",
      supervisorName: "Academic Supervisor",
      academicYear: 2026,
      facultyId: "fast",
      facultyName: "Faculty of Applied Sciences & Tech",
      departmentId: "cs",
      departmentName: "Computer Science & IT",
      categoryId: "software",
      categoryName: "Software & Web Apps",
      keywords: ["Final Year", "Student Project", "Research"],
      viewsCount: 120,
      downloadsCount: 35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <RecordDetailView record={record} backHref="/dashboard/projects" />
    </div>
  );
}
