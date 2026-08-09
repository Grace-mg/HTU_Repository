import { createAdminClient } from "./../src/lib/supabase/admin";
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

const adminSupabase = createAdminClient();

async function testAdminInsert() {
  console.log("Testing insert into repository_records using createAdminClient()...");
  
  const slug = "test-submission-admin-" + Date.now();
  const rowData = {
    title: "Test Submission Admin Project Title",
    slug,
    record_type: "PROJECT",
    status: "PENDING_HOD",
    abstract: "This is a test abstract that satisfies all length requirements for project submission.",
    student_name: "Test Student Name",
    student_id: "0420269999",
    supervisor_name: "Dr. Test Supervisor",
    academic_year: 2026,
    faculty_id: "fast",
    department_id: "cs",
    category_id: "software",
    keywords: ["Test", "Project"],
  };

  const { data, error } = await adminSupabase
    .from("repository_records")
    .insert(rowData)
    .select("*, faculties(name), departments(name), categories(name)")
    .single();

  console.log("Admin insert error:", error);
  console.log("Admin insert data:", data ? { id: data.id, title: data.title, status: data.status } : null);
}

testAdminInsert();
