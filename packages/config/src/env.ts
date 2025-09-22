
import { z } from "zod";

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Ground Zero"),
});

export type Env = z.infer<typeof baseSchema>;

export function loadEnv(raw: NodeJS.ProcessEnv): Env {
  const parsed = baseSchema.safeParse(raw);
  if (!parsed.success) {
    const pretty = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error("Invalid environment variables:\n" + pretty);
  }
  return parsed.data;
}

export const env = loadEnv(process.env);
