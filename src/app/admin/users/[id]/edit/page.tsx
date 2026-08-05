"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [userData, setUserData] = React.useState({
    id: params.id || "usr-001",
    name: "System Administrator",
    email: "wonderdogbe595@gmail.com",
    role: "ADMIN" as UserRole,
  });

  const [selectedRole, setSelectedRole] = React.useState<UserRole>("ADMIN");
  const [success, setSuccess] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  // Check self-demotion warning if target email is the active admin email
  const isSelfAccount = userData.email === "wonderdogbe595@gmail.com";
  const isSelfDemoting = isSelfAccount && selectedRole === "USER";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setUserData((prev) => ({ ...prev, role: selectedRole }));
    setTimeout(() => {
      setSuccess(false);
      router.push("/admin/users");
    }, 1200);
  };

  const handleSendResetLink = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to User Accounts Table
      </Link>

      <PageHeader
        title={`Edit User Account (${params.id})`}
        description="View account profile, reassign system roles, or trigger security credential resets."
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>User account role updated successfully! Redirecting...</span>
        </div>
      )}

      {resetSent && (
        <div className="rounded-md border border-blue-200 bg-blue-50/80 p-3.5 text-xs text-blue-900 flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span>Password recovery link dispatched to {userData.email}</span>
        </div>
      )}

      {/* Self Demotion Warning */}
      {isSelfDemoting && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Self-Demotion Warning</p>
            <p className="leading-relaxed">
              You are modifying your own active administrator account ({userData.email}). Demoting this account to <span className="font-semibold">USER</span> will revoke your administrative privileges.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
          User Credentials & Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Full Name</label>
            <Input value={userData.name} disabled className="text-xs h-9 bg-muted/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Email Address</label>
            <Input value={userData.email} disabled className="text-xs h-9 bg-muted/50" />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5 border-t border-border pt-4">
          <label className="text-xs font-semibold text-foreground block">
            System Role Assignment
          </label>
          <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as UserRole)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER (Standard Student / Faculty)</SelectItem>
              <SelectItem value="ADMIN">ADMIN (System Administrator)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security Reset Actions */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-foreground">Password Recovery</h3>
            <p className="text-[11px] text-muted-foreground">Send a password reset email link to this user.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendResetLink}
            className="text-xs font-semibold gap-1.5 shrink-0"
          >
            <KeyRound className="h-3.5 w-3.5" /> Dispatch Password Reset
          </Button>
        </div>

        {/* Save Controls */}
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/admin/users">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6"
            disabled={isSelfDemoting}
          >
            Save Role Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
