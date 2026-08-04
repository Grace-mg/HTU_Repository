import * as React from "react";
import { notFound } from "next/navigation";
import { RecordDetailView } from "@/components/projects/record-detail-view";
import { RepositoryRecord } from "@/types/repository";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const record: RepositoryRecord = {
    id: id,
    title: id === "1"
      ? "IoT Solar-Powered Smart Irrigation System"
      : id === "2"
      ? "Commercial HVAC Energy Optimization System"
      : id === "3"
      ? "AI Resume & ATS Portfolio Platform"
      : id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: id,
    recordType: "PROJECT",
    status: "PUBLISHED",
    abstract: `This engineering project presents a working software build and hardware prototype created by graduating students of Ho Technical University. The system addresses critical operational bottlenecks through automated sensors, cloud telemetry, and user-centered interface design. The complete design documentation and source files are published following HOD review and approval.`,
    studentName: "Kwaku Bonsu & Team",
    studentId: "HTU/ENG/2026/088",
    supervisorName: "Ing. Dr. Ebenezer Osei",
    academicYear: 2026,
    facultyId: "eng",
    facultyName: "Faculty of Engineering",
    departmentId: "agric",
    departmentName: "Agricultural Engineering",
    categoryId: "hardware",
    categoryName: "Hardware & IoT Prototypes",
    keywords: ["IoT", "Solar Power", "Irrigation", "Hardware Prototype", "Automation"],
    viewsCount: 256,
    downloadsCount: 68,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
    publishedAt: "2026-01-18T00:00:00Z",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RecordDetailView record={record} />
    </div>
  );
}
