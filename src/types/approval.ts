export type ApprovalStage =
  | "PENDING_HOD"
  | "PENDING_DEAN"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "RETURNED_FOR_REVISION";

export type ApprovalActionType =
  | "APPROVE"
  | "REJECT"
  | "REQUEST_REVISION"
  | "PUBLISH";

export interface ApprovalAuditLog {
  id: string;
  recordId: string;
  stage: ApprovalStage;
  action: ApprovalActionType;
  actorName: string;
  actorRole: string;
  comment?: string;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  recordId: string;
  title: string;
  studentName: string;
  studentId?: string;
  supervisorName: string;
  departmentName: string;
  facultyName: string;
  recordType: "PROJECT" | "THESIS";
  currentStage: ApprovalStage;
  submittedAt: string;
  abstract: string;
  fileName?: string;
  fileSize?: number;
}
