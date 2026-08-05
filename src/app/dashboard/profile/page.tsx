"use client";

import * as React from "react";
import { User as UserIcon, Mail, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { profileUpdateSchema, ProfileUpdateInput } from "@/lib/validation/user";

export default function ProfilePage() {
  const [formData, setFormData] = React.useState<ProfileUpdateInput>({
    name: "System User",
    email: "user@university.edu",
    facultyId: "fast",
    departmentId: "cs",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const result = profileUpdateSchema.safeParse(formData);

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
      setSuccessMessage("Profile information has been updated successfully.");
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Profile Settings"
        description="View and update your personal details, email address, and academic department affiliation."
      />

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
          Personal Information
        </h2>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-9 text-xs h-9"
            />
          </div>
          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground block" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-9 text-xs h-9"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Academic Affiliation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Faculty Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Faculty Affiliation
            </label>
            <Select
              value={formData.facultyId || "fast"}
              onValueChange={(val) => setFormData({ ...formData, facultyId: val })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Faculty of Applied Sciences & Tech</SelectItem>
                <SelectItem value="hbs">HTU Business School</SelectItem>
                <SelectItem value="eng">Faculty of Engineering</SelectItem>
                <SelectItem value="art">Faculty of Art & Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Department
            </label>
            <Select
              value={formData.departmentId || "cs"}
              onValueChange={(val) => setFormData({ ...formData, departmentId: val })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="agric">Agricultural Engineering</SelectItem>
                <SelectItem value="electrical">Electrical Engineering</SelectItem>
                <SelectItem value="fashion">Fashion Design & Textiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border flex justify-end">
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
