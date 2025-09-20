import { signUpSchema } from "@/schemas/sign-up.schema";
import { SIGN_UP_INPUT } from "__tests__/helpers/test-data";
import { describe, expect, it } from "vitest";
import z from "zod";

describe("SignUpSchema", () => {
  const input = SIGN_UP_INPUT;

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

  it("returns false if the password is too short", () => {
    const res = signUpSchema.safeParse({
      ...input,
      password: "123",
      confirmPassword: "123",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(z.treeifyError(res.error)).toBeTruthy();
    }
  });

  it("returns false if the passwords do not match", () => {
    const res = signUpSchema.safeParse({
      ...input,
      confirmPassword: "different",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(z.treeifyError(res.error)).toHaveProperty(
        "properties.confirmPassword",
      );
      expect(
        z.treeifyError(res.error).properties?.confirmPassword,
      ).toBeDefined();
    }
  });

  it("returns false if there are extra keys", () => {
    const res = signUpSchema.safeParse({ ...input, extra: "field" } as any);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(
        res.error.issues.some(
          (i) => i.code === "unrecognized_keys" && i.keys?.includes("extra"),
        ),
      ).toBe(true);
    }
  });

  it("returns false if confirmPassword is missing", () => {
    const { confirmPassword: _confirmPassword, ...withoutConfirm } = input;
    const res = signUpSchema.safeParse(withoutConfirm);

    expect(res.success).toBe(false);
  });
});
