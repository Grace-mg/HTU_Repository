import { Faculty } from "@/types/faculty";
import { FacultyInput } from "@/lib/validation/organization";

export interface FacultyService {
  getFaculties(): Promise<Faculty[]>;
  getFacultyById(id: string): Promise<Faculty | null>;
  createFaculty(input: FacultyInput): Promise<Faculty>;
  updateFaculty(id: string, input: Partial<FacultyInput>): Promise<Faculty>;
  deleteFaculty(id: string): Promise<void>;
}
