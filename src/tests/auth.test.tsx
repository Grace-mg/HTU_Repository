import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import VerifyEmailPage from "@/app/(auth)/verify-email/page";

import HomePage from "@/app/(public)/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/login",
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 8 Authentication Pages & Session Workflow Tests", () => {
  it("renders Landing Page with Explore the Archive CTA pointing to /browse", () => {
    render(<HomePage />);
    const exploreLinks = screen.getAllByRole("link", { name: /explore the archive/i });
    expect(exploreLinks.length).toBeGreaterThan(0);
    expect(exploreLinks[0].getAttribute("href")).toBe("/browse");
  });

  it("renders Login page correctly as the authentication session entry point", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders Register page correctly without role selector", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    // Verify no role selector is rendered (must be strict)
    expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
  });

  it("renders Forgot Password page correctly", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/registered email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("renders Verify Email page correctly", () => {
    render(<VerifyEmailPage />);
    expect(screen.getByRole("heading", { name: /enter verification code/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend 8-digit code/i })).toBeInTheDocument();
  });
});

