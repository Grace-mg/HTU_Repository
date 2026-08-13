export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  facultyId?: string;
  departmentId?: string;
  studentId?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: number;
}

export interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
