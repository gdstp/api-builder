import assert from "node:assert";

export function requireEnv(key: string): string {
  const value = process.env[key]?.replace(/\\/g, "");

  assert(value, `required env variable ${key} is unset`);

  return value;
}
