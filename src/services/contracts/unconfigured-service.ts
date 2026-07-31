import { DataSourceNotConfiguredError } from "@/lib/errors/app-error";
import { AuthService } from "./auth-service";
import { RepositoryService } from "./repository-service";
import { FacultyService } from "./faculty-service";
import { DepartmentService } from "./department-service";
import { CategoryService } from "./category-service";
import { BookmarkService } from "./bookmark-service";
import { UserService } from "./user-service";
import { ReportService } from "./report-service";
import { SettingsService } from "./settings-service";
import { FileService } from "./file-service";
import { RepositoryFilters } from "@/types/repository";
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/lib/validation/auth";
import { CreateRepositoryRecordInput, UpdateRepositoryRecordInput } from "@/lib/validation/repository";
import { FacultyInput, DepartmentInput, CategoryInput } from "@/lib/validation/organization";
import { ProfileUpdateInput, PasswordChangeInput } from "@/lib/validation/user";
import { RepositorySettingsInput } from "@/lib/validation/settings";
import { PaginationParams } from "@/types/pagination";

export class UnconfiguredAuthService implements AuthService {
  async login(_input: LoginInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async register(_input: RegisterInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async logout(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async forgotPassword(_input: ForgotPasswordInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async resetPassword(_input: ResetPasswordInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getCurrentUser(): Promise<null> { return null; }
  async getSession(): Promise<null> { return null; }
}

export class UnconfiguredRepositoryService implements RepositoryService {
  async getRecords(_filters: RepositoryFilters): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getRecordBySlug(_slug: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getRecordById(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async createRecord(_input: CreateRepositoryRecordInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateRecord(_id: string, _input: UpdateRepositoryRecordInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async deleteRecord(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async incrementViews(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async incrementDownloads(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredFacultyService implements FacultyService {
  async getFaculties(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getFacultyById(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async createFaculty(_input: FacultyInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateFaculty(_id: string, _input: Partial<FacultyInput>): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async deleteFaculty(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredDepartmentService implements DepartmentService {
  async getDepartments(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getDepartmentsByFaculty(_facultyId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async createDepartment(_input: DepartmentInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateDepartment(_id: string, _input: Partial<DepartmentInput>): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async deleteDepartment(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredCategoryService implements CategoryService {
  async getCategories(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getCategoryBySlug(_slug: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async createCategory(_input: CategoryInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateCategory(_id: string, _input: Partial<CategoryInput>): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async deleteCategory(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredBookmarkService implements BookmarkService {
  async getUserBookmarks(_userId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async addBookmark(_userId: string, _recordId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async removeBookmark(_userId: string, _recordId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async isBookmarked(_userId: string, _recordId: string): Promise<boolean> { return false; }
}

export class UnconfiguredUserService implements UserService {
  async getUsers(_params: PaginationParams): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getUserById(_id: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateUserProfile(_userId: string, _input: ProfileUpdateInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async changePassword(_userId: string, _input: PasswordChangeInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredReportService implements ReportService {
  async getReportSummary(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async exportRecordsData(_filters: RepositoryFilters, _format: "csv" | "json"): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredSettingsService implements SettingsService {
  async getSettings(): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async updateSettings(_input: RepositorySettingsInput): Promise<never> { throw new DataSourceNotConfiguredError(); }
}

export class UnconfiguredFileService implements FileService {
  async uploadFile(_file: File | Blob, _fileName: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async deleteFile(_fileId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
  async getFileDownloadUrl(_fileId: string): Promise<never> { throw new DataSourceNotConfiguredError(); }
}
