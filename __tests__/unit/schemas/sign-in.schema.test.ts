import { signInSchema } from "@/schemas/sign-in.schema";
import { SIGN_IN_INPUT } from "__tests__/helpers/test-data";
import { describe, expect, it } from "vitest";
import z from "zod";

describe("SignInSchema", () => {
  const input = SIGN_IN_INPUT;
  it("should return true if the input is valid", () => {
    const result = signInSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("should return false if the password is too short", () => {
    const result = signInSchema.safeParse({ ...input, password: "1234567" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.treeifyError(result.error)).toBeTruthy();
    }
  });

  it("should return false if the email is invalid", () => {
    const result = signInSchema.safeParse({ ...input, email: "test@test" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.treeifyError(result.error)).toBeTruthy();
    }
  });
});
