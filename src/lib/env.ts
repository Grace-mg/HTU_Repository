import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.string().min(1)).default("https://placeholder-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

function parseEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    console.warn("⚠️ Invalid environment variables:", result.error.format());
    return {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://placeholder-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: undefined,
    };
  }

  return result.data;
}

export const env = parseEnv();
