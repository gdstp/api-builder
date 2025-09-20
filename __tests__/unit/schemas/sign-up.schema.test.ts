import { signUpSchema } from "@/schemas/sign-up.schema";
import { describe, expect, it } from "vitest";
import z from "zod";

describe("SignUpSchema", () => {
  const input = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "123456789",
    confirmPassword: "123456789",
  };

  it("returns true if the payload is valid", () => {
    const res = signUpSchema.safeParse(input);

    expect(res.success).toBe(true);
  });

  it("returns false if the email is invalid", () => {
    const res = signUpSchema.safeParse({ ...input, email: "not-an-email" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(z.treeifyError(res.error)).toBeTruthy();
    }
  });
});
