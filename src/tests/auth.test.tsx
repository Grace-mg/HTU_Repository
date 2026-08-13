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
  it("renders Landing Page with Sign In button pointing to authentication session (/login)", () => {
    render(<HomePage />);
    const signInLinks = screen.getAllByRole("link", { name: /sign in/i });
    expect(signInLinks.length).toBeGreaterThan(0);
    expect(signInLinks[0].getAttribute("href")).toBe("/login");
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
    expect(screen.getByRole("heading", { name: /verify your email/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
  });
});

