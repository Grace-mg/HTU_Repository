"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRepositoryRecordSchema, CreateRepositoryRecordInput } from "@/lib/validation/repository";
import { adminService } from "@/services/supabase-admin-service";
import { HTU_FACULTIES, HTU_DEPARTMENTS, getDepartmentsByFaculty } from "@/lib/constants/faculties-departments";

export default function AddNewRecordPage() {
  const router = useRouter();

  const [categories, setCategories] = React.useState<any[]>([
    { id: "cat-1", name: "Software & Web Apps" },
    { id: "cat-2", name: "Hardware & IoT Prototypes" },
    { id: "cat-3", name: "Fashion & Textile Design" },
    { id: "cat-4", name: "Research & Analytical Theses" },
  ]);

  const [formData, setFormData] = React.useState<CreateRepositoryRecordInput>({
    title: "",
    recordType: "PROJECT",
    status: "DRAFT",
    abstract: "",
    studentName: "",
    studentId: "",
    supervisorName: "",
    academicYear: 2026,
    facultyId: "fast",
    departmentId: "cs",
    categoryId: "cat-1",
    keywords: ["Academic", "Project"],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Available child departments cascading from currently selected Faculty
  const availableDepartments = React.useMemo(() => {
    return getDepartmentsByFaculty(formData.facultyId || "fast");
  }, [formData.facultyId]);

  React.useEffect(() => {
    async function loadFormOptions() {
      const cats = await adminService.getCategories();
      if (cats && cats.length > 0) setCategories(cats);
    }
    loadFormOptions();
  }, []);

  // When faculty changes, update departmentId to the first child department under the selected faculty
  const handleFacultyChange = (facultyId: string) => {
    const childDepts = getDepartmentsByFaculty(facultyId);
    const firstDeptId = childDepts[0]?.id || "";
    setFormData((prev) => ({
      ...prev,
      facultyId,
      departmentId: firstDeptId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const result = createRepositoryRecordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const created = await adminService.createRecord(formData);
    setIsSubmitting(false);

    setSuccess(true);
    setTimeout(() => router.push("/admin/records"), 1200);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/records"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Records Management
      </Link>

      <PageHeader
        title="Add New Repository Record"
        description="Upload and publish student projects or academic research theses."
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>Record created successfully! Redirecting to records list...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="title">
            Record Title
          </label>
          <Input
            id="title"
            placeholder="e.g. IoT Solar-Powered Smart Crop Irrigation System"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xs h-9"
          />
          {errors.title && <p className="text-[11px] font-medium text-destructive">{errors.title}</p>}
        </div>

        {/* Record Type, Category, and Initial Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Record Type</label>
            <Select
              value={formData.recordType}
              onValueChange={(val) => setFormData({ ...formData, recordType: val as any })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROJECT">Project</SelectItem>
                <SelectItem value="THESIS">Thesis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Category</label>
            <Select
              value={formData.categoryId || ""}
              onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Initial Status</label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val as any })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="PENDING_HOD">Pending HOD Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cascading Faculty -> Department Select Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              1. Parent Faculty
            </label>
            <Select
              value={formData.facultyId || "fast"}
              onValueChange={handleFacultyChange}
            >
              <SelectTrigger className="h-9 text-xs font-medium">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {HTU_FACULTIES.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              2. Child Department
            </label>
            <Select
              value={formData.departmentId || ""}
              onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
            >
              <SelectTrigger className="h-9 text-xs font-medium">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="academicYear">
              Academic Year
            </label>
            <Input
              id="academicYear"
              type="number"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: Number(e.target.value) })}
              className="text-xs h-9"
            />
          </div>
        </div>

        {/* Student & Supervisor Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="studentName">
              Student Name
            </label>
            <Input
              id="studentName"
              placeholder="John Doe"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="text-xs h-9"
            />
            {errors.studentName && <p className="text-[11px] font-medium text-destructive">{errors.studentName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="studentId">
              Student ID / Index No.
            </label>
            <Input
              id="studentId"
              placeholder="0420261234"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="supervisorName">
              Supervisor Name
            </label>
            <Input
              id="supervisorName"
              placeholder="Dr. Seth Mensah"
              value={formData.supervisorName}
              onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
              className="text-xs h-9"
            />
            {errors.supervisorName && <p className="text-[11px] font-medium text-destructive">{errors.supervisorName}</p>}
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="abstract">
            Abstract & Overview
          </label>
          <textarea
            id="abstract"
            rows={4}
            placeholder="Comprehensive abstract description (min. 20 characters)..."
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.abstract && <p className="text-[11px] font-medium text-destructive">{errors.abstract}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/admin/records">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
