import { Department } from "@/types/department";
import { DepartmentInput } from "@/lib/validation/organization";

export interface DepartmentService {
  getDepartments(): Promise<Department[]>;
  getDepartmentsByFaculty(facultyId: string): Promise<Department[]>;
  createDepartment(input: DepartmentInput): Promise<Department>;
  updateDepartment(id: string, input: Partial<DepartmentInput>): Promise<Department>;
  deleteDepartment(id: string): Promise<void>;
}
