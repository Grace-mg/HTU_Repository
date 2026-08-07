"use client";

import * as React from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ─────────────── Page Header Banner ─────────────── */
function PageBanner() {
  return (
    <section className="w-full bg-background border-b border-border py-14 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Have questions, feedback, or need support? Reach out to the Project
          HUB team and we&apos;ll get back to you as soon as possible.
        </p>
      </div>
    </section>
  );
}

/* ─────────────── Contact Info Cards ─────────────── */
function ContactInfoCards() {
  const contactItems = [
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "Ho Technical University",
      sub: "P.O. Box HP 217, Ho, Volta Region, Ghana",
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "projecthub@htu.edu.gh",
      sub: "We typically respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+233 (0) 36 202 6823",
      sub: "Monday – Friday, 8:00 AM – 5:00 PM",
    },
    {
      icon: Clock,
      title: "Office Hours",
      detail: "Mon – Fri: 8 AM – 5 PM",
      sub: "Weekends & public holidays: Closed",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactItems.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md transition-shadow text-center"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <item.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="text-sm font-semibold text-foreground">{item.detail}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Contact Form ─────────────── */
function ContactFormSection() {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: In production, this would send to an API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="w-full bg-card border-y border-border py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Message Sent!
          </h2>
          <p className="text-muted-foreground">
            Thank you for reaching out. Our team will review your message and
            respond within 24 hours. You can also reach us directly via email
            at{" "}
            <span className="font-semibold text-foreground">
              projecthub@htu.edu.gh
            </span>
            .
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormState({ name: "", email: "", subject: "", message: "" });
            }}
            variant="outline"
            className="rounded-full px-6 py-2 text-xs font-bold tracking-wider uppercase"
          >
            Send Another Message
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-card border-y border-border py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Info */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            Get In Touch
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Send Us a Message
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Whether you&apos;re a student needing help with your submission, a
            faculty member with questions about the review process, or a visitor
            curious about the platform — we&apos;d love to hear from you.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground">projecthub@htu.edu.gh</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Phone Support</p>
                <p className="text-xs text-muted-foreground">+233 (0) 36 202 6823</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Location</p>
                <p className="text-xs text-muted-foreground">
                  Ho Technical University, Ho, Volta Region, Ghana
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-background p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-foreground tracking-wide uppercase">
                Full Name
              </label>
              <Input
                id="contact-name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-bold text-foreground tracking-wide uppercase">
                Email Address
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="text-xs font-bold text-foreground tracking-wide uppercase">
              Subject
            </label>
            <Input
              id="contact-subject"
              name="subject"
              value={formState.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-bold text-foreground tracking-wide uppercase">
              Message
            </label>
            <Textarea
              id="contact-message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
              rows={5}
              className="text-sm resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-blue-600/30"
          >
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}

/* ─────────────── FAQ Section ─────────────── */
function FAQSection() {
  const faqs = [
    {
      q: "Who can submit projects to Project HUB?",
      a: "Final year students of Ho Technical University who have completed their project or thesis can submit through their student dashboard after registration.",
    },
    {
      q: "How long does the approval process take?",
      a: "Submissions are typically reviewed within 3–5 business days by department heads and university administrators.",
    },
    {
      q: "Can anyone browse the repository?",
      a: "Yes! The public archive is freely accessible to students, faculty, researchers, and the general public.",
    },
    {
      q: "How do I report an issue with a published record?",
      a: "Use the contact form above or email us directly at projecthub@htu.edu.gh with the record title and details of the issue.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Quick answers to common questions about Project HUB.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 space-y-2"
            >
              <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Contact Page ─────────────── */
export default function ContactPage() {
  return (
    <>
      <PageBanner />
      <ContactInfoCards />
      <ContactFormSection />
      <FAQSection />
    </>
  );
}
