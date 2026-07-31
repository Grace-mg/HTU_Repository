import { RepositorySettings } from "@/types/settings";
import { RepositorySettingsInput } from "@/lib/validation/settings";

export interface SettingsService {
  getSettings(): Promise<RepositorySettings>;
  updateSettings(input: RepositorySettingsInput): Promise<RepositorySettings>;
}
