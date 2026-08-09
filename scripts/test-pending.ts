import { createClient } from "@supabase/supabase-js";
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

const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminClient = createAdminClient();

async function testPending() {
  console.log("Fetching pending approvals via ANON key...");
  const { data: anonData, error: anonError } = await anonClient
    .from("repository_records")
    .select("*, faculties(name), departments(name), categories(name)")
    .in("status", ["PENDING_HOD", "PENDING_DEAN"]);
  console.log("ANON key pending result:", { count: anonData?.length, error: anonError });

  console.log("Fetching pending approvals via ADMIN service role key...");
  const { data: adminData, error: adminError } = await adminClient
    .from("repository_records")
    .select("*, faculties(name), departments(name), categories(name)")
    .in("status", ["PENDING_HOD", "PENDING_DEAN"]);
  console.log("ADMIN key pending result:", { count: adminData?.length, data: adminData, error: adminError });
}

testPending();
