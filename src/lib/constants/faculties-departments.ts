export interface FacultyOption {
  id: string;
  name: string;
  code: string;
}

export interface DepartmentOption {
  id: string;
  facultyId: string;
  name: string;
  code: string;
}

export const HTU_FACULTIES: FacultyOption[] = [
  { id: "fast", name: "Faculty of Applied Sciences & Tech (FAST)", code: "FAST" },
  { id: "eng", name: "Faculty of Engineering (ENG)", code: "ENG" },
  { id: "hbs", name: "HTU Business School (HBS)", code: "HBS" },
  { id: "art", name: "Faculty of Art & Design (ART)", code: "ART" },
  { id: "bne", name: "Faculty of Built & Natural Environment (BNE)", code: "BNE" },
  { id: "fass", name: "Faculty of Applied Social Sciences (FASS)", code: "FASS" },
];

export const HTU_DEPARTMENTS: DepartmentOption[] = [
  // FAST
  { id: "cs", facultyId: "fast", name: "Computer Science", code: "CS" },
  { id: "htm", facultyId: "fast", name: "Hospitality & Tourism Management", code: "HTM" },
  { id: "math", facultyId: "fast", name: "Mathematics & Statistics", code: "STATS" },
  { id: "food", facultyId: "fast", name: "Food Technology", code: "FOOD" },
  { id: "it", facultyId: "fast", name: "Information Technology", code: "IT" },

  // ENG
  { id: "agric", facultyId: "eng", name: "Agricultural Engineering", code: "AGRIC" },
  { id: "civil", facultyId: "eng", name: "Civil Engineering", code: "CIVIL" },
  { id: "eee", facultyId: "eng", name: "Electrical & Electronic Engineering", code: "EEE" },
  { id: "mech", facultyId: "eng", name: "Mechanical Engineering", code: "MECH" },
  { id: "auto", facultyId: "eng", name: "Automotive Engineering", code: "AUTO" },

  // HBS
  { id: "acc", facultyId: "hbs", name: "Accountancy", code: "ACC" },
  { id: "bf", facultyId: "hbs", name: "Banking & Finance", code: "BF" },
  { id: "mkt", facultyId: "hbs", name: "Marketing", code: "MKT" },
  { id: "sms", facultyId: "hbs", name: "Secretaryship & Management Studies", code: "SMS" },
  { id: "psm", facultyId: "hbs", name: "Procurement & Supply Chain Management", code: "PSM" },

  // ART
  { id: "fdt", facultyId: "art", name: "Fashion Design & Textiles", code: "FDT" },
  { id: "ia", facultyId: "art", name: "Industrial Art", code: "IA" },
  { id: "gd", facultyId: "art", name: "Graphic Design & Advertising", code: "GD" },

  // BNE
  { id: "bt", facultyId: "bne", name: "Building Technology", code: "BT" },
  { id: "em", facultyId: "bne", name: "Estate Management", code: "EM" },
  { id: "sm", facultyId: "bne", name: "Surveying & Mapping", code: "SM" },

  // FASS
  { id: "msls", facultyId: "fass", name: "Multilingual Secretarial & Language Studies", code: "MSLS" },
  { id: "ls", facultyId: "fass", name: "Liberal Studies & General Studies", code: "LS" },
];

export function getDepartmentsByFaculty(facultyId: string): DepartmentOption[] {
  if (!facultyId || facultyId === "all") return HTU_DEPARTMENTS;
  return HTU_DEPARTMENTS.filter((d) => d.facultyId === facultyId);
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const HTU_CATEGORIES: CategoryOption[] = [
  { id: "software", name: "Software & Web Apps", slug: "software-web-apps", description: "Web platforms, mobile apps, and enterprise software." },
  { id: "hardware", name: "Hardware & IoT Prototypes", slug: "hardware-iot-prototypes", description: "Microcontrollers, solar telemetry, and IoT sensors." },
  { id: "fashion", name: "Fashion & Textile Design", slug: "fashion-textile-design", description: "Sustainable textiles, apparel design, and pattern drafting." },
  { id: "thesis", name: "Research & Analytical Theses", slug: "research-analytical-theses", description: "Academic research dissertations and statistical papers." },
];

