import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const val = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (key) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log("[Database Seed] Starting Supabase database table provisioning & seeding...");

  // 1. Seed Faculties
  const faculties = [
    { id: "fast", name: "Faculty of Applied Sciences & Tech", code: "FAST" },
    { id: "eng", name: "Faculty of Engineering", code: "ENG" },
    { id: "hbs", name: "HTU Business School", code: "HBS" },
    { id: "art", name: "Faculty of Art & Design", code: "ART" },
    { id: "bne", name: "Faculty of Built & Natural Env", code: "BNE" },
    { id: "fass", name: "Faculty of Applied Social Sciences", code: "FASS" },
  ];

  for (const fac of faculties) {
    await supabase.from("faculties").upsert(fac, { onConflict: "id" });
  }
  console.log("✓ Faculties seeded successfully.");

  // 2. Seed Departments
  const departments = [
    { id: "cs", faculty_id: "fast", name: "Computer Science", code: "CS", hod_name: "Dr. Emmanuel Addo", hod_email: "eaddo@htu.edu.gh", is_active: true },
    { id: "agric", faculty_id: "eng", name: "Agricultural Engineering", code: "AGRIC", hod_name: "Dr. Seth Mensah", hod_email: "smensah@htu.edu.gh", is_active: true },
    { id: "electrical", faculty_id: "eng", name: "Electrical & Electronic Engineering", code: "EEE", hod_name: "Ing. Francis Kpodo", hod_email: "fkpodo@htu.edu.gh", is_active: true },
    { id: "fashion", faculty_id: "art", name: "Fashion Design & Textiles", code: "FDT", hod_name: "Mrs. Joyce Amankwah", hod_email: "jamankwah@htu.edu.gh", is_active: true },
  ];

  for (const dept of departments) {
    await supabase.from("departments").upsert(dept, { onConflict: "id" });
  }
  console.log("✓ Departments seeded successfully.");

  // 3. Seed Categories
  const categories = [
    { id: "software", name: "Software & Web Apps", slug: "software-web-apps", description: "Software applications and web platforms" },
    { id: "hardware", name: "Hardware & IoT Prototypes", slug: "hardware-iot-prototypes", description: "Embedded hardware systems and IoT crop sensors" },
    { id: "fashion", name: "Fashion & Textile Design", slug: "fashion-textile-design", description: "Apparel designs and textile innovations" },
    { id: "thesis", name: "Research & Analytical Theses", slug: "research-analytical-theses", description: "Academic research dissertations" },
  ];

  for (const cat of categories) {
    await supabase.from("categories").upsert(cat, { onConflict: "id" });
  }
  console.log("✓ Categories seeded successfully.");

  // 4. Seed Sample Records
  const records = [
    {
      title: "IoT Solar-Powered Smart Crop Irrigation System",
      slug: "iot-solar-powered-smart-crop-irrigation-system",
      record_type: "PROJECT",
      status: "PUBLISHED",
      abstract: "An automated solar powered crop irrigation prototype with IoT sensor telemetry for Ghanaian agricultural farms.",
      student_name: "Kwaku Bonsu",
      student_id: "0420261234",
      supervisor_name: "Dr. Seth Mensah",
      academic_year: 2026,
      faculty_id: "eng",
      department_id: "agric",
      category_id: "hardware",
      keywords: ["Solar", "IoT", "Irrigation", "Agriculture"],
      views_count: 420,
      downloads_count: 142,
    },
    {
      title: "Machine Learning Crop Yield Prediction in Sub-Saharan Africa",
      slug: "machine-learning-crop-yield-prediction-sub-saharan-africa",
      record_type: "THESIS",
      status: "PUBLISHED",
      abstract: "Predictive analytics research paper assessing crop yield forecasting models across Ghanaian farming regions.",
      student_name: "Ama Serwaa",
      student_id: "0420261235",
      supervisor_name: "Dr. Emmanuel Addo",
      academic_year: 2026,
      faculty_id: "fast",
      department_id: "cs",
      category_id: "thesis",
      keywords: ["Machine Learning", "Agriculture", "Prediction", "Analytics"],
      views_count: 385,
      downloads_count: 118,
    },
  ];

  for (const rec of records) {
    await supabase.from("repository_records").upsert(rec, { onConflict: "slug" });
  }
  console.log("✓ Sample Academic Records seeded successfully.");

  console.log("🎉 Database seeding complete!");
}

main().catch(console.error);
