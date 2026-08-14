import { User, AuthSession } from "@/types/auth";
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/lib/validation/auth";

export interface AuthService {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  forgotPassword(input: ForgotPasswordInput): Promise<void>;
  resetPassword(input: ResetPasswordInput): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<AuthSession | null>;
  verifyOtp?(email: string, token: string): Promise<AuthSession>;
  acceptAdminInvite?(password: string, fullName?: string, targetEmail?: string): Promise<AuthSession>;
}
