import { User } from "@/types/auth";
import { ProfileUpdateInput, PasswordChangeInput } from "@/lib/validation/user";
import { PaginatedResult, PaginationParams } from "@/types/pagination";

export interface UserService {
  getUsers(params: PaginationParams): Promise<PaginatedResult<User>>;
  getUserById(id: string): Promise<User | null>;
  updateUserProfile(userId: string, input: ProfileUpdateInput): Promise<User>;
  changePassword(userId: string, input: PasswordChangeInput): Promise<void>;
}
