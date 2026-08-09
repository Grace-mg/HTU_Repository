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

async function checkDepts() {
  const { data, error } = await adminSupabase.from("departments").select("*");
  console.log("Departments in DB error:", error);
  console.log("Departments in DB count:", data?.length);
  console.log("Departments in DB:", data);
}

checkDepts();
