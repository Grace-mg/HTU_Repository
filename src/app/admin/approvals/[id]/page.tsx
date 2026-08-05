"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Building2,
  FileText,
  Download,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ApprovalStage } from "@/types/approval";

export default function ApprovalDetailPage({ params }: { params: { id: string } }) {
  const [currentStage, setCurrentStage] = React.useState<ApprovalStage>("PENDING_HOD");
  const [feedback, setFeedback] = React.useState("");
  const [notice, setNotice] = React.useState<string | null>(null);

  const approvalItem = {
    id: params.id || "req-101",
    title: "AI-Powered Microgrid Solar Optimization for Rural Clinics",
    studentName: "Kwame Asante",
    studentId: "0420261234",
    supervisorName: "Dr. Seth Mensah",
    supervisorEmail: "smensah@university.edu",
    departmentName: "Electrical Engineering",
    facultyName: "Faculty of Engineering",
    recordType: "PROJECT",
    submittedAt: "2026-08-04T09:15:00Z",
    abstract: `This project presents an automated microgrid solar energy optimization framework designed specifically for off-grid rural healthcare facilities. Utilizing IoT edge sensor telemetry combined with lightweight machine learning algorithms, the system dynamically balances battery storage load and solar generation to eliminate power outages during medical procedures.`,
    fileName: "Kwame_Asante_Solar_Microgrid.pdf",
    fileSize: 4200000,
  };

  const auditLogs = [
    {
      id: "log-1",
      stage: "DRAFT",
      action: "SUBMITTED",
      actorName: "Kwame Asante (Student)",
      timestamp: "2026-08-04T09:15:00Z",
      comment: "Initial project submission uploaded for supervisor & HOD review.",
    },
    {
      id: "log-2",
      stage: "PENDING_HOD",
      action: "REVIEW_IN_PROGRESS",
      actorName: "Dr. Seth Mensah (Supervisor)",
      timestamp: "2026-08-04T11:30:00Z",
      comment: "Approved by supervisor. Forwarded to HOD for departmental endorsement.",
    },
  ];

  const handleAction = (nextStage: ApprovalStage, message: string) => {
    setCurrentStage(nextStage);
    setNotice(message);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/approvals"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Approvals Queue
      </Link>

      {/* Header Banner & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-600 text-white text-[10px]">{approvalItem.recordType}</Badge>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
              {currentStage}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-foreground">{approvalItem.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">Submission ID: {approvalItem.id}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            onClick={() => handleAction("APPROVED", "Submission approved successfully!")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve Record
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => handleAction("REJECTED", "Submission rejected.")}
            className="text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <XCircle className="h-4 w-4" /> Reject
          </Button>
        </div>
      </div>

      {notice && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Submission Meta Panel */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Student Name & ID</span>
            <span className="font-semibold text-foreground">{approvalItem.studentName} ({approvalItem.studentId})</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Supervisor</span>
            <span className="font-semibold text-foreground">{approvalItem.supervisorName} ({approvalItem.supervisorEmail})</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Department & Faculty</span>
            <span className="font-semibold text-foreground">{approvalItem.departmentName} • {approvalItem.facultyName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Submission Timestamp</span>
            <span className="font-medium text-foreground">{approvalItem.submittedAt}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <h2 className="text-xs font-bold text-foreground">Abstract</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{approvalItem.abstract}</p>
        </div>

        {/* Attached File Inspection Card */}
        <div className="border-t border-border pt-4">
          <h2 className="text-xs font-bold text-foreground mb-3">Attached Document</h2>
          <div className="rounded-lg border border-border bg-muted/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-foreground">{approvalItem.fileName}</div>
                <div className="text-[11px] text-muted-foreground">PDF Document • 4.2 MB</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 h-8">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Approval Audit Timeline */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-xs">
        <h2 className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Clock className="h-4 w-4 text-blue-600" /> Approval Audit Trail
        </h2>

        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-xs">
              <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                ✓
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">{log.actorName}</div>
                <div className="text-[11px] text-muted-foreground">{log.timestamp} • Action: {log.action}</div>
                {log.comment && <p className="text-muted-foreground italic">&ldquo;{log.comment}&rdquo;</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
