export interface DownloadableRecord {
  title: string;
  studentName: string;
  studentId?: string;
  groupMembers?: { name: string; email: string; studentId?: string }[];
  supervisorName: string;
  departmentName?: string;
  facultyName?: string;
  academicYear?: number;
  recordType?: string;
  abstract: string;
  fileUrl?: string;
  fileName?: string;
}

export function downloadProjectPDF(record: DownloadableRecord) {
  if (typeof window === "undefined") return;

  // 1. If a valid external or blob URL is present, download directly
  if (
    record.fileUrl &&
    (record.fileUrl.startsWith("http://") ||
      record.fileUrl.startsWith("https://") ||
      record.fileUrl.startsWith("blob:") ||
      record.fileUrl.startsWith("data:"))
  ) {
    const a = document.createElement("a");
    a.href = record.fileUrl;
    a.download = record.fileName || `${record.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // 2. Fallback: Generate an official formatted HTU Repository document Blob
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const teamSection = record.groupMembers && record.groupMembers.length > 0
    ? `\nCO-AUTHORS / GROUP MEMBERS:\n` + record.groupMembers.map((m, i) => `  ${i + 1}. ${m.name} (${m.email})${m.studentId ? ` [ID: ${m.studentId}]` : ""}`).join("\n")
    : "";

  const content = `================================================================================
HO TECHNICAL UNIVERSITY - ACADEMIC REPOSITORY
OFFICIAL RESEARCH THESIS / FINAL YEAR PROJECT DOCUMENTATION
================================================================================

DOCUMENT TITLE:
${record.title.toUpperCase()}

SUBMISSION SUMMARY:
--------------------------------------------------------------------------------
Record Type:        ${record.recordType || "PROJECT"}
Academic Year:      ${record.academicYear || 2026}
Date Generated:     ${dateStr}

STUDENT & TEAM MEMBERS:
--------------------------------------------------------------------------------
Lead Student:       ${record.studentName}
Student Index ID:   ${record.studentId || "N/A"}${teamSection}

ACADEMIC AFFILIATION:
--------------------------------------------------------------------------------
Faculty:            ${record.facultyName || "Faculty of Applied Sciences & Tech"}
Department:         ${record.departmentName || "Computer Science"}

SUPERVISOR DETAILS:
--------------------------------------------------------------------------------
Supervisor Name:    ${record.supervisorName}

EXECUTIVE ABSTRACT:
--------------------------------------------------------------------------------
${record.abstract}

================================================================================
Archived & Verified in HTU Academic Repository.
Ho Technical University, Volta Region, Ghana.
================================================================================
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const safeStudent = (record.studentName || "Student").replace(/[^a-z0-9]/gi, "_");
  const defaultName = `${safeStudent}_${record.recordType || "Project"}_Submission.pdf`;
  const filename = record.fileName || defaultName;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
