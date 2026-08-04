import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { RepositoryRecord } from "@/types/repository";

interface RepositorySlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RepositorySlugPage({ params }: RepositorySlugPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Fallback demo record when data source is not yet populated
  const record: RepositoryRecord = {
    id: slug,
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: slug,
    recordType: slug.toLowerCase().includes("thesis") ? "THESIS" : "PROJECT",
    status: "PUBLISHED",
    abstract: `This project presents an empirical investigation and practical system implementation developed at Ho Technical University. The work focuses on design parameters, hardware/software specifications, and evaluation criteria validated during the 2026 academic showcase. All documentation and source artifacts have been reviewed and approved by the department head.`,
    studentName: "Kwaku Mensah",
    studentId: "HTU/CS/2026/014",
    supervisorName: "Dr. Seth Mensah",
    academicYear: 2026,
    facultyId: "fast",
    facultyName: "Faculty of Applied Sciences & Technology",
    departmentId: "cs",
    departmentName: "Computer Science",
    categoryId: "software",
    categoryName: "Software & Web Apps",
    keywords: ["Repository", "Engineering", "Ho Technical University", "2026 Showcase"],
    viewsCount: 128,
    downloadsCount: 34,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
    publishedAt: "2026-01-20T00:00:00Z",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RecordDetailView record={record} />
    </div>
  );
}
