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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, anonKey);

async function testInsert() {
  console.log("Testing insert into repository_records using ANON key...");
  
  const slug = "test-submission-" + Date.now();
  const rowData = {
    title: "Test Submission Project Title",
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

  const { data, error } = await supabase
    .from("repository_records")
    .insert(rowData)
    .select("*, faculties(name), departments(name), categories(name)")
    .single();

  console.log("Result error:", error);
  console.log("Result data:", data);
}

testInsert();
