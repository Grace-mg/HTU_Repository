"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDepartmentSchema, CreateDepartmentInput } from "@/lib/validation/department";
import { adminService } from "@/services/supabase-admin-service";

export default function AddDepartmentPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState<CreateDepartmentInput>({
    name: "",
    code: "",
    facultyId: "fast",
    hodName: "",
    hodEmail: "",
    isActive: true,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const result = createDepartmentSchema.safeParse(formData);

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
    const created = await adminService.createDepartment(formData);
    setIsSubmitting(false);

    setSuccess(true);
    setTimeout(() => router.push("/admin/departments"), 1000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/departments"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Departments List
      </Link>

      <PageHeader
        title="Add New Department"
        description="Register an academic department and assign its Head of Department (HOD)."
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>Department created successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Department Name & Code Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="name">
              Department Name
            </label>
            <Input
              id="name"
              placeholder="e.g. Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-xs h-9"
            />
            {errors.name && <p className="text-[11px] font-medium text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="code">
              Department Code
            </label>
            <Input
              id="code"
              placeholder="e.g. CS"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="text-xs h-9 uppercase font-mono"
            />
            {errors.code && <p className="text-[11px] font-medium text-destructive">{errors.code}</p>}
          </div>
        </div>

        {/* Parent Faculty Selector with all 6 HTU Faculties */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block">
            Parent Faculty
          </label>
          <Select
            value={formData.facultyId}
            onValueChange={(val) => setFormData({ ...formData, facultyId: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Faculty of Applied Sciences & Tech (FAST)</SelectItem>
              <SelectItem value="eng">Faculty of Engineering (ENG)</SelectItem>
              <SelectItem value="hbs">HTU Business School (HBS)</SelectItem>
              <SelectItem value="art">Faculty of Art & Design (ART)</SelectItem>
              <SelectItem value="bne">Faculty of Built & Natural Environment (BNE)</SelectItem>
              <SelectItem value="fass">Faculty of Applied Social Sciences (FASS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* HOD Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="hodName">
              Head of Department (HOD) Name
            </label>
            <Input
              id="hodName"
              placeholder="Dr. Emmanuel Addo"
              value={formData.hodName}
              onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
              className="text-xs h-9"
            />
            {errors.hodName && <p className="text-[11px] font-medium text-destructive">{errors.hodName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="hodEmail">
              HOD Official Email
            </label>
            <Input
              id="hodEmail"
              type="email"
              placeholder="eaddo@htu.edu.gh"
              value={formData.hodEmail}
              onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
              className="text-xs h-9"
            />
            {errors.hodEmail && <p className="text-[11px] font-medium text-destructive">{errors.hodEmail}</p>}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/admin/departments">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Create Department"}
          </Button>
        </div>
      </form>
    </div>
  );
}
