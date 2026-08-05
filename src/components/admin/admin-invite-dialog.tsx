"use client";

import * as React from "react";
import { Mail, CheckCircle2, UserPlus, Shield, AlertCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const inviteAdminSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
});

export interface AdminInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (email: string) => void;
}

export function AdminInviteDialog({ open, onOpenChange, onSuccess }: AdminInviteDialogProps) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const result = inviteAdminSchema.safeParse({ fullName, email });
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
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setServerError(data.error || "Failed to dispatch email invitation.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onSuccess?.(email);
      setFullName("");
      setEmail("");
      onOpenChange(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setServerError(err.message || "Network error dispatching invitation.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-600" /> Invite Administrator by Email
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Send an official email invitation to grant administrative privileges to a faculty or staff member.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              placeholder="Dr. Seth Mensah"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-xs h-9"
            />
            {errors.fullName && <p className="text-[11px] font-medium text-destructive">{errors.fullName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block" htmlFor="email">
              Candidate Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="smensah@htu.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs h-9"
            />
            {errors.email && <p className="text-[11px] font-medium text-destructive">{errors.email}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              {isSubmitting ? "Dispatching..." : "Dispatch Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
