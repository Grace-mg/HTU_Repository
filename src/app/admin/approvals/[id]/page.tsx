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
import { adminService } from "@/services/supabase-admin-service";
import { RepositoryRecord } from "@/types/repository";
import { ApprovalStage } from "@/types/approval";

import { downloadProjectPDF } from "@/lib/utils/download";

export default function ApprovalDetailPage({ params }: { params: { id: string } }) {
  const [record, setRecord] = React.useState<RepositoryRecord | null>(null);
  const [currentStage, setCurrentStage] = React.useState<ApprovalStage>("PENDING_HOD");
  const [notice, setNotice] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    async function loadRecord() {
      if (!params.id) return;
      const data = await adminService.getRecordById(params.id);
      if (data) {
        setRecord(data);
        setCurrentStage((data.status as ApprovalStage) || "PENDING_HOD");
      }
    }
    loadRecord();
  }, [params.id]);

  const handleAction = async (nextStage: ApprovalStage, message: string) => {
    if (!params.id) return;
    setIsUpdating(true);
    const targetStatus = nextStage === "APPROVED" ? "PUBLISHED" : nextStage;
    const ok = await adminService.updateRecordStatus(params.id, targetStatus as any);
    setIsUpdating(false);
    if (ok) {
      setCurrentStage(nextStage);
      setNotice(message);
    }
  };

  const approvalItem = record
    ? {
        id: record.id,
        title: record.title,
        studentName: record.studentName,
        studentId: record.studentId || "N/A",
        supervisorName: record.supervisorName,
        supervisorEmail: `${record.supervisorName.toLowerCase().replace(/[^a-z]/g, "")}@htu.edu.gh`,
        departmentName: record.departmentName || "Department",
        facultyName: record.facultyName || "Faculty",
        recordType: record.recordType,
        submittedAt: record.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A",
        abstract: record.abstract,
        fileName: record.fileName || `${record.studentName.replace(/\s+/g, "_")}_Submission.pdf`,
        fileSize: record.fileSize || 2048000,
      }
    : {
        id: params.id || "req-101",
        title: "Record Not Found",
        studentName: "N/A",
        studentId: "N/A",
        supervisorName: "N/A",
        supervisorEmail: "n/a@htu.edu.gh",
        departmentName: "N/A",
        facultyName: "N/A",
        recordType: "PROJECT",
        submittedAt: "N/A",
        abstract: "The requested project submission record could not be loaded.",
        fileName: "submission.pdf",
        fileSize: 0,
      };

  const auditLogs = [
    {
      id: "log-1",
      stage: "DRAFT",
      action: "SUBMITTED",
      actorName: `${approvalItem.studentName} (Student)`,
      timestamp: approvalItem.submittedAt,
      comment: "Initial project submission uploaded for supervisor & HOD review.",
    },
  ];

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
            disabled={isUpdating || currentStage === "APPROVED"}
            onClick={() => handleAction("APPROVED", "Submission approved successfully!")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" /> {isUpdating ? "Updating..." : "Approve Record"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isUpdating || currentStage === "REJECTED"}
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
            <span className="font-semibold text-foreground">{approvalItem.supervisorName}</span>
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

        {/* Group Members Section */}
        {record?.groupMembers && record.groupMembers.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              Project Team & Group Members ({record.groupMembers.length + 1} Total)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-2.5">
                <span className="font-bold text-foreground block">{approvalItem.studentName} (Lead Student)</span>
                <span className="text-[11px] text-muted-foreground block">ID: {approvalItem.studentId}</span>
              </div>
              {record.groupMembers.map((member, idx) => (
                <div key={member.email + idx} className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <span className="font-bold text-foreground block">{member.name}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 block">{member.email}</span>
                  {member.studentId && <span className="text-[10px] text-muted-foreground block">ID: {member.studentId}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attached File Inspection Card */}
        <div className="border-t border-border pt-4">
          <h2 className="text-xs font-bold text-foreground mb-3">Attached Document</h2>
          <div className="rounded-lg border border-border bg-muted/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-foreground">{approvalItem.fileName}</div>
                <div className="text-[11px] text-muted-foreground">PDF Document • {(approvalItem.fileSize / (1024 * 1024)).toFixed(1)} MB</div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                downloadProjectPDF({
                  title: approvalItem.title,
                  studentName: approvalItem.studentName,
                  studentId: approvalItem.studentId,
                  supervisorName: approvalItem.supervisorName,
                  departmentName: approvalItem.departmentName,
                  facultyName: approvalItem.facultyName,
                  recordType: approvalItem.recordType,
                  abstract: approvalItem.abstract,
                  groupMembers: record?.groupMembers,
                  fileName: approvalItem.fileName,
                  fileUrl: record?.fileUrl,
                })
              }
              className="text-xs font-semibold gap-1.5 h-8 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 border-blue-200 dark:border-blue-800"
            >
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
