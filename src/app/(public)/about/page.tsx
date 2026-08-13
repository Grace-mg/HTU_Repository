import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  Globe,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Project HUB — the official Ho Technical University final year project and thesis repository.",
};

/* ─────────────── Page Header Banner ─────────────── */
function PageBanner() {
  return (
    <section className="w-full bg-background border-b border-border py-14 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          About Project HUB
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          The official centralized repository for academic projects and theses
          from Ho Technical University&apos;s graduating class.
        </p>
      </div>
    </section>
  );
}

/* ─────────────── Mission Section ─────────────── */
function MissionSection() {
  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            Our Mission
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Preserving Academic Innovation
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Project HUB was built to solve the challenge of preserving and
            showcasing final year academic work. Before this platform,
            graduating students&apos; projects and theses were scattered across
            departments with no centralized archive.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Now, every approved project and thesis is digitally archived,
            searchable, and accessible to current students, faculty, and the
            public — ensuring that academic innovation is never lost.
          </p>
        </div>
        <div className="relative rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: GraduationCap, label: "Student Projects", value: "200+" },
              { icon: BookOpen, label: "Theses Archived", value: "150+" },
              { icon: Building2, label: "Departments", value: "12+" },
              { icon: Users, label: "Active Users", value: "500+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-blue-600" />
                <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse & Search",
      description:
        "Explore student innovations and theses across faculties and departments using keywords or category filters.",
      icon: Search,
    },
    {
      number: "02",
      title: "Student Submission",
      description:
        "Graduating students upload their final year project or thesis documentation directly through their portal dashboard.",
      icon: GraduationCap,
    },
    {
      number: "03",
      title: "Academic Review",
      description:
        "Department heads and administrators review submissions for academic quality, completeness, and institutional compliance.",
      icon: ShieldCheck,
    },
    {
      number: "04",
      title: "Public Access & Files",
      description:
        "Approved records are published to the public archive where students, faculty, and researchers can view and download documentation.",
      icon: Globe,
    },
  ];

  return (
    <section className="w-full bg-slate-50 dark:bg-muted/30 border-y border-border/60 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            How It Works
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            From Submission to Public Archive
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
            Discover how final year projects are submitted, reviewed, and published to the university repository in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">{step.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA Section ─────────────── */
function CTASection() {
  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Ready to Explore?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Browse hundreds of academic projects and theses from Ho Technical
          University&apos;s graduating class. Search by faculty, department,
          category, or keyword.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-blue-600/30"
          >
            <Link href="/browse">
              Browse Projects
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[180px] border-border bg-card text-foreground hover:bg-accent rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── About Page ─────────────── */
export default function AboutPage() {
  return (
    <>
      <PageBanner />
      <MissionSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
