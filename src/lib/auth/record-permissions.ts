import { RepositoryRecord } from "@/types/repository";

/**
 * Checks whether a repository record is approved and published.
 */
export function isRecordApproved(status?: string): boolean {
  if (!status) return true; // Default to true if unassigned for backwards compatibility
  const upper = status.toUpperCase();
  return upper === "PUBLISHED" || upper === "APPROVED";
}

/**
 * Checks if a given user has permission to view a repository record.
 * - Approved/Published records can be viewed by anyone (including unauthenticated guests).
 * - Pending/Draft/Rejected records can ONLY be viewed by:
 *   1. Administrators
 *   2. The lead student author
 *   3. Group members tagged on the project
 */
export function canUserAccessRecord(record: RepositoryRecord | null | undefined, user: any | null): boolean {
  if (!record) return false;

  // 1. Approved or published records are publicly accessible
  if (isRecordApproved(record.status)) {
    return true;
  }

  // 2. Pending/Draft/Rejected records require a logged-in user
  if (!user) {
    return false;
  }

  // 3. System administrators can view all records regardless of status
  if (user.role === "ADMIN") {
    return true;
  }

  const uEmail = (user.email || "").toLowerCase().trim();
  const uName = (user.name || user.full_name || "").toLowerCase().trim();
  const uStudentId = (user.studentId || user.student_id || "").toLowerCase().trim();

  // 4. Check if lead student author
  const recStudentName = (record.studentName || "").toLowerCase().trim();
  const recStudentId = (record.studentId || "").toLowerCase().trim();

  const isLeadAuthor =
    (uStudentId && recStudentId && recStudentId === uStudentId) ||
    (uName && recStudentName && recStudentName === uName) ||
    (uEmail && uName && recStudentName.includes(uName)) ||
    (uEmail && uEmail.split("@")[0] === recStudentName);

  if (isLeadAuthor) {
    return true;
  }

  // 5. Check if tagged group member
  if (record.groupMembers && Array.isArray(record.groupMembers)) {
    const isTaggedGroupMember = record.groupMembers.some((gm: any) => {
      const gmEmail = (gm.email || "").toLowerCase().trim();
      const gmId = (gm.studentId || "").toLowerCase().trim();
      const gmName = (gm.name || "").toLowerCase().trim();

      return (
        (uEmail && gmEmail && gmEmail === uEmail) ||
        (uStudentId && gmId && gmId === uStudentId) ||
        (uName && gmName && gmName === uName)
      );
    });

    if (isTaggedGroupMember) {
      return true;
    }
  }

  // 6. User is not tagged on this pending project
  return false;
}
