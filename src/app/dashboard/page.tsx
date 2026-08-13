"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  Bookmark,
  Building2,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { RepositoryRecordCard } from "@/components/projects/repository-record-card";
import { RepositoryRecord } from "@/types/repository";
import { repositoryService } from "@/services/supabase-repository-service";
import { SupabaseAuthService } from "@/services/supabase-auth-service";

const authService = new SupabaseAuthService();

export default function UserDashboardPage() {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userRecords, setUserRecords] = React.useState<RepositoryRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUserDataAndSubmissions() {
      setIsLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        // Fetch all repository records across all statuses
        const res = await repositoryService.getRecords({ status: "all" });
        const allRecords = res.records || [];

        if (user) {
          const uEmail = (user.email || "").toLowerCase().trim();
          const uName = (user.name || "").toLowerCase().trim();
          const uStudentId = (user.studentId || "").toLowerCase().trim();

          const matched = allRecords.filter((r) => {
            // Match lead author
            const isLead =
              (uName && r.studentName?.toLowerCase() === uName) ||
              (uStudentId && r.studentId?.toLowerCase() === uStudentId) ||
              (uEmail && r.studentName?.toLowerCase().includes(uName));

            if (isLead) return true;

            // Match any group member
            if (r.groupMembers && Array.isArray(r.groupMembers)) {
              return r.groupMembers.some((gm: any) => {
                const gmEmail = (gm.email || "").toLowerCase().trim();
                const gmId = (gm.studentId || "").toLowerCase().trim();
                const gmName = (gm.name || "").toLowerCase().trim();

                return (
                  (uEmail && gmEmail === uEmail) ||
                  (uStudentId && gmId === uStudentId) ||
                  (uName && gmName === uName)
                );
              });
            }

            return false;
          });

          setUserRecords(matched);
        } else {
          setUserRecords(allRecords.slice(0, 2));
        }
      } catch (err) {
        console.error("Failed to load user submissions:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserDataAndSubmissions();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner Header */}
      <PageHeader
        badge="User Portal Active"
        title={currentUser ? `Welcome back, ${currentUser.name || "Student"}` : "Welcome back to Project Hub"}
        description="Submit your final-year project, track your group project's review status, explore theses, and manage saved bookmarks."
        actions={
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2 h-10 px-5">
            <Link href="/dashboard/submit">
              <UploadCloud className="h-4 w-4" /> Submit Project
            </Link>
          </Button>
        }
      />

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/submit"
          className="group p-5 rounded-xl border border-blue-500/30 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-500/60 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UploadCloud className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors">
              Submit Project
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Upload thesis or project for HOD & Dean evaluation
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/projects"
          className="group p-5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/50">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors">
              Browse Projects
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Engineering builds, prototypes & software apps
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/theses"
          className="group p-5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950/50">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground group-hover:text-amber-600 transition-colors">
              Browse Theses
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Academic dissertations & research papers
            </p>
          </div>
        </Link>
      </div>

      {/* My Submissions & Group Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            My Submissions & Group Projects
          </h2>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/dashboard/submit">Submit New Project</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground rounded-xl border border-border bg-card">
            Loading your group project submissions...
          </div>
        ) : userRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRecords.map((rec) => (
              <RepositoryRecordCard key={rec.id} record={rec} showStatus />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-bold text-sm text-foreground">No group project submissions found</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you submit a project or when a teammate includes you as a group member, your project and its real-time approval status will appear here.
              </p>
            </div>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
              <Link href="/dashboard/submit">Submit Your Project</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Summary Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recently Saved Records Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-blue-600" />
              Recently Saved Records
            </h2>
            <Link
              href="/dashboard/saved"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-foreground">No saved records yet</h3>
              <p className="text-xs text-muted-foreground">
                Click the bookmark button while browsing projects or theses to store them in your personal saved records list.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
              <Link href="/browse">Browse Academic Records</Link>
            </Button>
          </div>
        </div>

        {/* Repository Quick Information Sidebar */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            Repository Summary
          </h2>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground font-medium">Access Status</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                Registered Student
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground font-medium">Primary Format</span>
              <span className="font-semibold text-foreground">PDF / Document</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground font-medium">Academic Year</span>
              <span className="font-semibold text-foreground">2026 Showcase</span>
            </div>
            <div className="pt-1">
              <p className="text-muted-foreground leading-relaxed">
                Need supervisor assistance or file access rights? Contact the academic department office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
