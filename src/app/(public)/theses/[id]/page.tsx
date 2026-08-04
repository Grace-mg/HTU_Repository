import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { RepositoryRecord } from "@/types/repository";

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

  const record: RepositoryRecord = {
    id: id,
    title: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: id,
    recordType: "THESIS",
    status: "PUBLISHED",
    abstract: `This academic thesis provides an analytical study and empirical research paper conducted by final year students at Ho Technical University. The study incorporates qualitative data collection, statistical modeling, and field evaluation to formulate evidence-based conclusions for industrial application.`,
    studentName: "Ama Serwaa",
    studentId: "HTU/FAST/2026/042",
    supervisorName: "Prof. Kofi Annan",
    academicYear: 2026,
    facultyId: "fast",
    facultyName: "Faculty of Applied Sciences & Technology",
    departmentId: "cs",
    departmentName: "Computer Science",
    categoryId: "thesis",
    categoryName: "Research & Analytical Theses",
    keywords: ["Academic Thesis", "Empirical Research", "Ho Technical University", "Data Analytics"],
    viewsCount: 184,
    downloadsCount: 45,
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-01-12T00:00:00Z",
    publishedAt: "2026-01-19T00:00:00Z",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RecordDetailView record={record} />
    </div>
  );
}
