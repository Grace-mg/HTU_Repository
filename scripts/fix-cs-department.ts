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

async function fixCsDepartment() {
  console.log("Fixing Computer Science department ID in Supabase DB...");

  // Delete 'efh' or update it to 'cs'
  const { error: delErr } = await adminSupabase.from("departments").delete().eq("id", "efh");
  console.log("Delete efh error:", delErr);

  const { data: upsertData, error: upsertErr } = await adminSupabase.from("departments").upsert(
    {
      id: "cs",
      faculty_id: "fast",
      name: "Computer Science",
      code: "CS",
      hod_name: "Dr. Emmanuel Addo",
      hod_email: "eaddo@htu.edu.gh",
      is_active: true,
    },
    { onConflict: "id" }
  );

  console.log("Upsert cs department result:", { upsertData, upsertErr });
}

fixCsDepartment();
