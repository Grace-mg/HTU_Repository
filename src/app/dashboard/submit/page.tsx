"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  FileText,
  Sparkles,
  Info,
  ShieldCheck,
  X,
  Plus,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRepositoryRecordSchema, CreateRepositoryRecordInput, GroupMemberInput } from "@/lib/validation/repository";
import { adminService } from "@/services/supabase-admin-service";
import { SupabaseAuthService } from "@/services/supabase-auth-service";
import { HTU_FACULTIES, HTU_DEPARTMENTS, HTU_CATEGORIES, getDepartmentsByFaculty } from "@/lib/constants/faculties-departments";
import { extractStudentIdFromEmail } from "@/lib/utils/student";

const authService = new SupabaseAuthService();

export default function StudentSubmitProjectPage() {
  const router = useRouter();

  const [categories, setCategories] = React.useState<any[]>(HTU_CATEGORIES);

  const [formData, setFormData] = React.useState<CreateRepositoryRecordInput>({
    title: "",
    recordType: "PROJECT",
    status: "DRAFT",
    abstract: "",
    studentName: "",
    studentId: "",
    supervisorName: "",
    academicYear: new Date().getFullYear(),
    facultyId: "fast",
    departmentId: "cs",
    categoryId: "software",
    keywords: ["Final Year", "Student Project"],
  });

  const [keywordInput, setKeywordInput] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Auto-populate logged in student name and student ID if available
  React.useEffect(() => {
    async function loadUserData() {
      const user = await authService.getCurrentUser();
      if (user) {
        const derivedStudentId = user.studentId || extractStudentIdFromEmail(user.email || "");
        setFormData((prev) => ({
          ...prev,
          studentName: prev.studentName || user.name || "",
          studentId: prev.studentId || derivedStudentId || "",
        }));
      }
      const cats = await adminService.getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        setFormData((prev) => ({
          ...prev,
          categoryId: cats.some((c: any) => c.id === prev.categoryId) ? prev.categoryId : cats[0].id,
        }));
      }
    }
    loadUserData();
  }, []);

  // Cascading departments from selected faculty
  const availableDepartments = React.useMemo(() => {
    return getDepartmentsByFaculty(formData.facultyId || "fast");
  }, [formData.facultyId]);

  const handleFacultyChange = (facultyId: string) => {
    const childDepts = getDepartmentsByFaculty(facultyId);
    const firstDeptId = childDepts[0]?.id || "";
    setFormData((prev) => ({
      ...prev,
      facultyId,
      departmentId: firstDeptId,
    }));
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, trimmed],
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((kw) => kw !== keywordToRemove),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size exceeds 50MB maximum limit." }));
        return;
      }
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
      setFile(selectedFile);
    }
  };

  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInput[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    if (!memberSearchQuery.trim() || memberSearchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(memberSearchQuery)}`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.users || []);
          setShowDropdown(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [memberSearchQuery]);

  const handleSelectMember = (user: any) => {
    if (groupMembers.some((m) => m.email.toLowerCase() === user.email.toLowerCase())) {
      setMemberSearchQuery("");
      setShowDropdown(false);
      return;
    }

    const derivedStudentId = user.studentId || extractStudentIdFromEmail(user.email || "");

    const newMember: GroupMemberInput = {
      userId: user.id,
      name: user.name,
      email: user.email,
      studentId: derivedStudentId,
    };

    setGroupMembers((prev) => [...prev, newMember]);
    setMemberSearchQuery("");
    setShowDropdown(false);
  };

  const handleAddManualEmail = () => {
    if (!memberSearchQuery.includes("@")) return;
    if (groupMembers.some((m) => m.email.toLowerCase() === memberSearchQuery.toLowerCase())) return;

    const emailTrimmed = memberSearchQuery.trim();
    const derivedStudentId = extractStudentIdFromEmail(emailTrimmed);

    const newMember: GroupMemberInput = {
      name: emailTrimmed.split("@")[0],
      email: emailTrimmed,
      studentId: derivedStudentId,
    };

    setGroupMembers((prev) => [...prev, newMember]);
    setMemberSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setGroupMembers((prev) => prev.filter((m) => m.email !== emailToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validate using Zod schema
    const fullData = { ...formData, groupMembers };
    const result = createRepositoryRecordSchema.safeParse(fullData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {
        form: "Please review and correct the highlighted fields below before submitting.",
      };
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedFileData: { fileUrl?: string; fileName?: string; fileSize?: number; mimeType?: string } = {};
      if (file) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });
        if (dataUrl) {
          uploadedFileData = {
            fileUrl: dataUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || "application/pdf",
          };
        }
      }

      // Student submissions enter as PENDING_HOD for supervisor / HOD approval queue
      const submissionData: CreateRepositoryRecordInput = {
        ...formData,
        ...uploadedFileData,
        groupMembers,
        status: "PENDING_HOD",
      };

      const created = await adminService.createRecord(submissionData);
      setIsSubmitting(false);

      if (created) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => router.push("/dashboard/projects"), 1500);
      } else {
        setErrors({ form: "Failed to submit project. Please verify all fields and try again." });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors({ form: err?.message || "Failed to submit project. Please verify all fields and try again." });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      <PageHeader
        title="Submit Final Year Project / Research Thesis"
        description="Upload your academic project or thesis to the HTU Repository system for supervisor & HOD evaluation."
      />

      {/* Submission Workflow Info Card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 sm:p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-foreground">Multi-Stage Evaluation Process</h4>
            <p className="text-muted-foreground leading-relaxed">
              Once submitted, your project enters the review queue. It will be reviewed by your assigned academic supervisor and Head of Department (HOD) before final archiving and public publication.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs text-green-900 flex items-center gap-3 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 dark:text-green-400" />
          <div>
            <p className="font-bold">Project Submitted Successfully!</p>
            <p className="text-green-800 dark:text-green-400 mt-0.5">
              Your submission is now queued for supervisor & HOD review. Redirecting to projects...
            </p>
          </div>
        </div>
      )}

      {errors.form && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Record Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Submission Type <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.recordType}
              onValueChange={(val: string) =>
                setFormData({ ...formData, recordType: val as "PROJECT" | "THESIS" })
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROJECT">Student Project (Software / IoT / Design)</SelectItem>
                <SelectItem value="THESIS">Academic Research Thesis / Dissertation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="academicYear">
              Academic Year <span className="text-destructive">*</span>
            </label>
            <Input
              id="academicYear"
              type="number"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: Number(e.target.value) })}
              className="text-xs h-9"
            />
            {errors.academicYear && <p className="text-[11px] font-medium text-destructive">{errors.academicYear}</p>}
          </div>
        </div>

        {/* Project Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="title">
            Project / Thesis Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder="e.g. Smart Solar-Powered Irrigation System with IoT Sensors"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xs h-9"
          />
          {errors.title && <p className="text-[11px] font-medium text-destructive">{errors.title}</p>}
        </div>

        {/* Abstract / Summary */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="abstract">
            Abstract & Project Summary <span className="text-destructive">*</span>
          </label>
          <textarea
            id="abstract"
            rows={4}
            placeholder="Describe the problem, methodology, implementation details, key outcomes, and tools used..."
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {errors.abstract && <p className="text-[11px] font-medium text-destructive">{errors.abstract}</p>}
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="studentName">
              Student Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="studentName"
              placeholder="e.g. Kwame Mensah"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="text-xs h-9"
            />
            {errors.studentName && <p className="text-[11px] font-medium text-destructive">{errors.studentName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="studentId">
              Student ID / Index Number
            </label>
            <Input
              id="studentId"
              placeholder="e.g. 0420261234"
              value={formData.studentId || ""}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="text-xs h-9"
            />
          </div>
        </div>

        {/* Group Project Members / Co-Authors Lookup Section */}
        <div className="space-y-3 rounded-lg border border-border/80 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600" /> Select Group Members / Co-Authors
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Search and add fellow students registered on the platform who collaborated on this project.
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-semibold text-blue-600 border-blue-200">
              {groupMembers.length} Added
            </Badge>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student by registered email or full name..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  className="pl-9 text-xs h-9"
                />
              </div>

              {memberSearchQuery.includes("@") && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddManualEmail}
                  className="text-xs h-9 px-3 gap-1 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Email
                </Button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectMember(user)}
                    className="w-full text-left px-3 py-2 rounded text-xs hover:bg-accent flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground">{user.email}</div>
                    </div>
                    {user.studentId && (
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {user.studentId}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Group Members Chips/Cards */}
          {groupMembers.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground">Added Team Members:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groupMembers.map((member, idx) => (
                  <div
                    key={member.email + idx}
                    className="flex items-center justify-between rounded-md border border-border bg-card p-2.5 text-xs shadow-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-foreground truncate">{member.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{member.email}</div>
                      {member.studentId && (
                        <div className="text-[10px] text-blue-600 font-mono">ID: {member.studentId}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.email)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Supervisor Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="supervisorName">
            Academic Supervisor Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="supervisorName"
            placeholder="e.g. Dr. Seth Mensah"
            value={formData.supervisorName}
            onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
            className="text-xs h-9"
          />
          {errors.supervisorName && <p className="text-[11px] font-medium text-destructive">{errors.supervisorName}</p>}
        </div>

        {/* Faculty & Department Cascading Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Faculty / School <span className="text-destructive">*</span>
            </label>
            <Select value={formData.facultyId} onValueChange={handleFacultyChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {HTU_FACULTIES.map((fac) => (
                  <SelectItem key={fac.id} value={fac.id}>
                    {fac.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facultyId && <p className="text-[11px] font-medium text-destructive">{errors.facultyId}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Department <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.departmentId}
              onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && <p className="text-[11px] font-medium text-destructive">{errors.departmentId}</p>}
          </div>
        </div>

        {/* Category Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block">
            Category <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.categoryId}
            onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-[11px] font-medium text-destructive">{errors.categoryId}</p>}
        </div>

        {/* Keywords Tagging Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">
            Keywords & Tech Stack Tags <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Python, IoT, React, Solar Energy"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              className="text-xs h-9 flex-1"
            />
            <Button
              type="button"
              onClick={handleAddKeyword}
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.keywords.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.keywords && <p className="text-[11px] font-medium text-destructive">{errors.keywords}</p>}
        </div>

        {/* File Attachment Upload Container */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground block">
            Project Documentation / Thesis File Attachment (PDF)
          </label>
          <div className="relative border-2 border-dashed border-border hover:border-blue-500/50 rounded-xl p-6 text-center transition-colors bg-muted/20">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <UploadCloud className="h-5 w-5" />
              </div>
              {file ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium text-foreground">
                    Drag and drop your project PDF here, or <span className="text-blue-600 hover:underline font-semibold">browse files</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Supported formats: PDF, DOCX (Max size: 50MB)
                  </p>
                </>
              )}
            </div>
          </div>
          {errors.file && <p className="text-[11px] font-medium text-destructive">{errors.file}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="text-xs h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6 gap-2"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <UploadCloud className="h-4 w-4" /> Submit Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
