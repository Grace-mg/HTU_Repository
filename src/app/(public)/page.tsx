import * as React from "react";
import Link from "next/link";
import { Search, GraduationCap, Building2, BookOpen, Calendar, ArrowRight, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────── Hero Section ─────────────────────── */
function HeroSection() {
  return (
    <section className="relative w-full bg-background text-foreground py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors">
      {/* Centered Written Content First */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Final Year Project Repository
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          Software builds, engineering prototypes, and fashion collections
          from this year&apos;s graduating class reviewed and approved by
          department heads, open for anyone to browse.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-blue-600/30"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[180px] border border-slate-200/80 dark:border-white/20 bg-white/40 dark:bg-white/10 backdrop-blur-md text-foreground hover:bg-white/70 dark:hover:bg-white/20 rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
          >
            <Link href="/browse">Explore the Archive</Link>
          </Button>
        </div>
      </div>

      {/* Feature Showcase Image Below Written Content */}
      <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative group z-10">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-amber-500 opacity-20 blur-xl group-hover:opacity-30 transition duration-500" />
        <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
          <img
            src="/Repository Assets/hero-image.png"
            alt="Project HUB Hero Showcase"
            className="w-full h-auto object-cover max-h-[550px] sm:max-h-[650px]"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Browse by Departments Section ─────────────── */
function BrowseByDepartmentsSection() {
  const departments = [
    {
      name: "Food Science and Technology Department",
      faculty: "Faculty of Applied Sciences",
      description: "Working prototypes, food processing research, and technical reports from this year's graduating class.",
      image: "/Repository Assets/download (39).jpg",
      href: "/browse?department=food-science",
      projectCount: 0,
    },
    {
      name: "Department of Fashion & Design",
      faculty: "Faculty of Art & Design",
      description: "Runway video presentations and collection notes from this year's final year fashion design projects.",
      image: "/Repository Assets/bb.jpg",
      href: "/browse?department=fashion-design",
      projectCount: 0,
    },
    {
      name: "Computer Science & IT",
      faculty: "Faculty of Computing",
      description: "Working apps and software builds, submitted with the repository source code and full documentation.",
      image: "/Repository Assets/computer IT.jpeg",
      href: "/browse?department=computer-science",
      projectCount: 0,
    },
    {
      name: "Electrical & Renewable Energy",
      faculty: "Faculty of Engineering",
      description: "Clean energy prototypes, solar charging infrastructure, and power system hardware designs.",
      image: "/Repository Assets/Solar Powered Charging Station - 22 Charging Station Ideas for Organized Tech Spaces - Lost At E Min.jpg",
      href: "/browse?department=electrical",
      projectCount: 0,
    },
    {
      name: "Mechanical Engineering",
      faculty: "Faculty of Engineering",
      description: "Smart building HVAC automation, CAD structural models, and energy efficiency thesis projects.",
      image: "/Repository Assets/Investment not only needs finance but also people with the right skills_ A pilot project, Vocational, Education and Training (VET) Toolbox 2, will support to develop skills in eleven sub-Saharan African countries.jpg",
      href: "/browse?department=mechanical",
      projectCount: 0,
    },
    {
      name: "Civil & Smart Building",
      faculty: "Faculty of Engineering",
      description: "Structural analysis reports, smart city urban designs, and eco-conscious building prototypes.",
      image: "/Repository Assets/Futuristic Smart Building.jpg",
      href: "/browse?department=civil",
      projectCount: 0,
    },
  ];

  return (
    <section className="w-full bg-background py-16 md:py-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Browse by Departments
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg max-w-2xl leading-relaxed">
              Explore student innovations across specialized academic disciplines
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-blue-600/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-bold rounded-full px-6 py-2.5 transition-all shadow-sm shrink-0"
          >
            <Link href="/browse" className="inline-flex items-center justify-center whitespace-nowrap">
              <span>View All Departments</span>
            </Link>
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-muted">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {dept.faculty}
                  </span>
                  <h3 className="text-xl font-extrabold text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dept.name}
                  </h3>
                </div>

                {/* Explore Department CTA Button */}
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 shadow-md shadow-blue-600/20 transition-all duration-200"
                >
                  <Link href={dept.href}>
                    <span>Explore Department</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Recently Uploaded Projects Section ─────────────── */
function RecentlyUploadedSection() {
  const projects = [
    {
      id: "HTU/CS/2026/014",
      title: "Agri Connect",
      description: "Digital platform connecting smallholder farmers to local agricultural markets and buyers.",
      program: "BTECH Computer Science · 2026",
      image: "/Repository Assets/Agriculteurs et technologie avancée en Afrique.jpg",
    },
    {
      id: "HTU/ICT/2026/009",
      title: "Vibe Market",
      description: "An interactive digital market space for student creators and small business vendors.",
      program: "HND ICT · 2026",
      image: "/Repository Assets/two-women-viewing-content-phone-local-african-market.jpg",
    },
    {
      id: "HTU/ENG/2026/031",
      title: "Solar-Powered Irrigation Rig",
      description: "Automated off-grid solar irrigation hardware prototype built for commercial crop farming.",
      program: "BTECH AUTOMOBILE ENG · 2026",
      image: "/Repository Assets/Solar Powered Charging Station - 22 Charging Station Ideas for Organized Tech Spaces - Lost At E Min.jpg",
    },
  ];

  return (
    <section className="w-full bg-slate-50 dark:bg-muted/30 py-16 md:py-24 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Recently Uploaded Projects
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Latest approved submissions from the graduating class of 2026
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 border-blue-600/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-bold">
            <Link href="/browse">
              View All Projects
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-border bg-white dark:bg-card"
            >
              {/* Upper Full-Bleed Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Lower Blue Banner Panel */}
              <div className="bg-blue-600 p-6 text-white flex flex-col justify-between flex-1 gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-100 font-medium block mb-1.5 opacity-90">
                    {proj.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-white leading-tight">
                    {proj.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-blue-50/90 font-normal">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-500/60 flex items-center justify-between text-xs font-medium text-blue-100">
                  <span>{proj.program}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA Section (Final Year Student & Stats) ─────────────── */
function CTASection() {
  const stats = [
    { label: "Faculties Represented", value: "5" },
    { label: "Current showcase year", value: "2026" },
  ];

  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden py-16 sm:py-20">
      {/* Background image */}
      <img
        src="/Repository Assets/EWURAMA on TikTok.jpg"
        alt="Graduating Students Showcase"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]" />

      {/* Content written directly on top of the image */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-4 sm:px-6 lg:px-8">
        {/* Two Round Stat Cards (Left Aligned to match text) */}
        <div className="flex flex-wrap items-start justify-start gap-12 sm:gap-20 pb-4 w-full">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 border-2 border-white/30 backdrop-blur-md shadow-2xl mb-3 transition-transform hover:scale-105">
                <span className="text-3xl font-black text-white sm:text-4xl">
                  {stat.value}
                </span>
              </div>
              <span className="text-sm font-semibold text-white/90">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl tracking-tight drop-shadow-md">
              Are you final year student?
            </h2>
            <p className="text-sm leading-relaxed text-slate-100 sm:text-base md:text-lg drop-shadow">
              Talk to your department admin or HOD to get your project reviewed
              and added to this year&apos;s showcase.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-blue-600/20 px-8 py-3.5 text-xs font-bold tracking-wider uppercase text-white transition-all duration-200 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Contact Us
          </Link>
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
      <CTASection />
    </>
  );
}
