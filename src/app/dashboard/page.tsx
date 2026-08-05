"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  Bookmark,
  Search,
  ArrowRight,
  Sparkles,
  User,
  Shield,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

export default function UserDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner Header */}
      <div className="rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>User Portal Active</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back to Project Hub
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Browse approved university projects, explore research theses, manage your saved bookmarks, and customize your profile settings.
            </p>
          </div>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2 shrink-0 h-10 px-5">
            <Link href="/browse">
              <Search className="h-4 w-4" /> Search Repository
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/projects"
          className="group p-5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/50">
              <FolderOpen className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
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

        <Link
          href="/dashboard/saved"
          className="group p-5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/50">
              <Bookmark className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground group-hover:text-purple-600 transition-colors">
              Saved Records
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              View your bookmarked research & builds
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group p-5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/50">
              <User className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-600 transition-colors">
              Profile & Account
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Manage personal info & security credentials
            </p>
          </div>
        </Link>
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
