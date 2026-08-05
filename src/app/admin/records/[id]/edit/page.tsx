"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRepositoryRecordSchema, CreateRepositoryRecordInput } from "@/lib/validation/repository";

export default function EditRecordPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [formData, setFormData] = React.useState<CreateRepositoryRecordInput>({
    title: "IoT Solar-Powered Smart Irrigation System",
    recordType: "PROJECT",
    status: "PUBLISHED",
    abstract: "An automated solar powered crop irrigation prototype with IoT sensor telemetry.",
    studentName: "Kwaku Bonsu",
    studentId: "0420261234",
    supervisorName: "Dr. Seth Mensah",
    academicYear: 2026,
    facultyId: "eng",
    departmentId: "agric",
    categoryId: "hardware",
    keywords: ["Solar", "IoT", "Irrigation"],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => router.push(`/admin/records/${params.id}`), 1200);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/admin/records/${params.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Cancel Edit & Return to Record
      </Link>

      <PageHeader
        title={`Edit Record (${params.id})`}
        description="Update metadata, change publication status, or revise student and supervisor details."
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>Record updated successfully! Redirecting...</span>
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xs h-9"
          />
          {errors.title && <p className="text-[11px] font-medium text-destructive">{errors.title}</p>}
        </div>

        {/* Record Type & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <SelectItem value="PROJECT">Engineering Project</SelectItem>
                <SelectItem value="THESIS">Academic Thesis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Status</label>
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
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
              </SelectContent>
            </Select>
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
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="text-xs h-9"
            />
            {errors.studentName && <p className="text-[11px] font-medium text-destructive">{errors.studentName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="studentId">
              Student ID
            </label>
            <Input
              id="studentId"
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
            Abstract
          </label>
          <textarea
            id="abstract"
            rows={4}
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.abstract && <p className="text-[11px] font-medium text-destructive">{errors.abstract}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href={`/admin/records/${params.id}`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
