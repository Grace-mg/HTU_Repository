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
  const email = "wonderdogbe595@gmail.com";
  const password = "Wonder123@";

  console.log(`[Admin Seed] Creating or updating Admin account for ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: "System Administrator",
      role: "ADMIN",
    },
  });

  if (error) {
    console.log(`[Notice] ${error.message}`);
    // If user already exists, update user_metadata to ADMIN and set email_confirm: true
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      console.log(`[Admin Seed] Updating existing user (${existingUser.id}) role to ADMIN...`);
      const { error: updateErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: existingUser.user_metadata?.full_name || "System Administrator",
          role: "ADMIN",
        },
      });

      if (updateErr) {
        console.error(`[Error] Failed to update user: ${updateErr.message}`);
      } else {
        console.log(`[Success] User ${email} updated successfully as ADMIN with confirmed email!`);
      }
    }
  } else {
    console.log(`[Success] Admin account created successfully! User ID: ${data.user.id}`);
  }
}

main().catch(console.error);
