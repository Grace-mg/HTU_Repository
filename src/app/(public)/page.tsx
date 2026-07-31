import * as React from "react";
import Link from "next/link";
import { Search, GraduationCap, Building2, BookOpen, Calendar, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";

/* ─────────────────────── Hero Section ─────────────────────── */
function HeroSection() {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image placeholder — will be replaced with real asset */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Final Year Project{" "}
          <span className="block">Repository</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">
          Software builds, engineering prototypes, and fashion collections
          from this year&apos;s graduating class reviewed and approved by
          department heads, open for anyone to browse
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[180px] gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 py-3 text-sm font-semibold">
            <Link href="/browse">
              <Search className="h-4 w-4" />
              Explore the Archive
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[180px] gap-2 border-white/80 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-md px-8 py-3 text-sm font-semibold"
          >
            <Link href="#how-it-works">
              How it works
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Browse by Departments Section ─────────────── */
function BrowseByDepartmentsSection() {
  return (
    <section className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Browse by Departments
        </h2>

        <div className="mt-10">
          <EmptyState
            title="No Departments Available"
            description="Department listings will appear here once the data source is connected."
            icon={Building2}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Recently Uploaded Projects Section ─────────────── */
function RecentlyUploadedSection() {
  return (
    <section className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Recently Uploaded Projects
        </h2>

        <div className="mt-10">
          <EmptyState
            title="No Projects Yet"
            description="Recently uploaded projects will appear here once the repository is populated."
            icon={FolderOpen}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Statistics Banner Section ─────────────── */
function StatisticsBannerSection() {
  const stats = [
    { label: "Faculties Represented", value: "—", icon: GraduationCap },
    { label: "Total Projects", value: "—", icon: BookOpen },
    { label: "Departments", value: "—", icon: Building2 },
    { label: "Current Showcase Year", value: "—", icon: Calendar },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image placeholder — will be replaced with real campus photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <span className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-white/70" />
                  <span className="text-xs font-medium text-white/80 sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA Section (Final Year Student) ─────────────── */
function CTASection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image placeholder — will be replaced with student photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-20 lg:px-8">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Are you final year student?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to your department admin or HOD to get your project reviewed
            and added to this year&apos;s showcase.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="min-w-[180px] rounded-md bg-amber-500 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Link href="/login">
            Sign In as HOD
          </Link>
        </Button>
      </div>
    </section>
  );
}

/* ─────────────── How It Works Section ─────────────── */
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse or Search",
      description: "Use the search bar or browse by department to find projects and theses from this year's graduating class.",
      icon: Search,
    },
    {
      number: "02",
      title: "View Project Details",
      description: "Read abstracts, view project metadata, and explore the full documentation submitted by students.",
      icon: BookOpen,
    },
    {
      number: "03",
      title: "Access Files",
      description: "Download approved project files and documentation according to the repository's access rules.",
      icon: FolderOpen,
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Discover and access final year projects in three simple steps
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center rounded-md border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Main Landing Page ─────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrowseByDepartmentsSection />
      <RecentlyUploadedSection />
      <StatisticsBannerSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
