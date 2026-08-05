"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, ShieldCheck, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export default function AdminRecordDetailPage({ params }: { params: { id: string } }) {
  const record = {
    id: params.id || "rec-001",
    title: "IoT Solar-Powered Smart Irrigation System",
    recordType: "PROJECT",
    status: "PUBLISHED",
    studentName: "Kwaku Bonsu",
    studentId: "0420261234",
    supervisorName: "Dr. Seth Mensah",
    academicYear: 2026,
    department: "Agricultural Engineering",
    faculty: "Faculty of Engineering",
    abstract: "An automated solar powered crop irrigation prototype with IoT sensor telemetry.",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-16T14:20:00Z",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/records"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Records Table
      </Link>

      {/* Header & Admin Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <Badge className="bg-blue-600 text-white text-[10px] mb-2">{record.recordType}</Badge>
          <h1 className="text-xl font-bold text-foreground">{record.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">ID: {record.id} • Year {record.academicYear}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
            <Link href={`/admin/records/${record.id}/edit`}>
              <Edit className="h-3.5 w-3.5" /> Edit Record
            </Link>
          </Button>
          <Button variant="destructive" size="sm" className="text-xs gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Student Name</span>
            <span className="font-semibold text-foreground">{record.studentName} ({record.studentId})</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Supervisor</span>
            <span className="font-semibold text-foreground">{record.supervisorName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Department & Faculty</span>
            <span className="font-semibold text-foreground">{record.department} • {record.faculty}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Publication Status</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{record.status}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h2 className="text-xs font-bold text-foreground mb-2">Abstract</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{record.abstract}</p>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3 text-xs">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" /> Audit Timeline
        </h2>
        <div className="space-y-2 text-muted-foreground">
          <p>Created on <span className="font-medium text-foreground">{record.createdAt}</span></p>
          <p>Last updated on <span className="font-medium text-foreground">{record.updatedAt}</span></p>
        </div>
      </div>
    </div>
  );
}
