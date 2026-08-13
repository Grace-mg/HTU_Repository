"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApprovalItem, ApprovalStage } from "@/types/approval";
import { adminService } from "@/services/supabase-admin-service";

export default function AdminApprovalsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState("all");

  const [items, setItems] = React.useState<ApprovalItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPending() {
      setLoading(true);
      const pendingRecords = await adminService.getPendingApprovals();
      if (pendingRecords) {
        const mappedItems: ApprovalItem[] = pendingRecords.map((r) => ({
          id: r.id,
          recordId: r.id,
          title: r.title,
          studentName: r.studentName,
          studentId: r.studentId || "N/A",
          supervisorName: r.supervisorName,
          departmentName: r.departmentName || "Department",
          facultyName: r.facultyName || "Faculty",
          recordType: r.recordType,
          currentStage: (r.status as ApprovalStage) || "PENDING_HOD",
          submittedAt: r.createdAt,
          abstract: r.abstract,
          fileName: r.fileName || `${r.studentName.replace(/\s+/g, "_")}_Submission.pdf`,
          fileSize: r.fileSize || 1024,
        }));
        setItems(mappedItems);
      } else {
        setItems([]);
      }
      setLoading(false);
    }
    loadPending();
  }, []);

  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        stageFilter === "all" || item.currentStage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [items, searchQuery, stageFilter]);

  const handleApprove = async (id: string, recordId: string) => {
    await adminService.updateRecordStatus(recordId, "PUBLISHED");
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, currentStage: "APPROVED" as ApprovalStage } : i
      )
    );
  };

  const handleOpenRejectModal = (item: ApprovalItem) => {
    setSelectedItem(item);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedItem) return;
    await adminService.updateRecordStatus(selectedItem.recordId, "REJECTED");
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, currentStage: "REJECTED" as ApprovalStage } : i
      )
    );
    setRejectModalOpen(false);
    setSelectedItem(null);
    setRejectionReason("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <PageHeader
        title="Record Approval Queue"
        description="Review, verify, and approve incoming student project and thesis submissions from Supabase database."
      />

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Review Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Review Stages</SelectItem>
            <SelectItem value="PENDING_HOD">Pending HOD Review</SelectItem>
            <SelectItem value="PENDING_DEAN">Pending Dean Review</SelectItem>
            <SelectItem value="APPROVED">Approved & Published</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Approvals Table */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Submission Details</th>
              <th className="p-4">Student & Faculty</th>
              <th className="p-4">Current Review Stage</th>
              <th className="p-4">Submission Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-xs text-muted-foreground">
                  Loading pending approval submissions from database...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-xs text-muted-foreground">
                  No submissions pending approval.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-medium max-w-xs">
                    <div className="font-bold text-foreground line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">{item.fileName}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{item.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">{item.departmentName}</div>
                  </td>
                  <td className="p-4">
                    {item.currentStage === "PENDING_HOD" && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                        Pending HOD
                      </Badge>
                    )}
                    {item.currentStage === "PENDING_DEAN" && (
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">
                        Pending Dean
                      </Badge>
                    )}
                    {item.currentStage === "APPROVED" && (
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-2 border-emerald-500 text-[10px] font-bold">
                        Approved
                      </Badge>
                    )}
                    {item.currentStage === "REJECTED" && (
                      <Badge variant="destructive" className="text-[10px]">
                        Rejected
                      </Badge>
                    )}
                  </td>
                  <td suppressHydrationWarning className="p-4 text-muted-foreground">
                    {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link href={`/admin/approvals/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {item.currentStage !== "APPROVED" && item.currentStage !== "REJECTED" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2"
                            onClick={() => handleApprove(item.id, item.recordId)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-[11px] h-7 px-2"
                            onClick={() => handleOpenRejectModal(item)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Submission Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Reject Record Submission
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Please provide feedback explaining why this submission is being rejected so the student can revise.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-foreground block">
              Rejection Reason & Feedback
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Missing signed declaration page or abstract needs formatting..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              className="text-xs font-semibold px-4"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
