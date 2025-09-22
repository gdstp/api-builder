import { profileSchema } from "@/schemas/profile.schema";
import { describe, expect, it } from "vitest";
import z from "zod";

describe("ProfileSchema", () => {
  it("should return true if the input is valid", () => {
    const result = profileSchema.safeParse({ userId: "1" });

    expect(result.success).toBe(true);
  });

  it("should return false if the userId is not a string", () => {
    const result = profileSchema.safeParse({ userId: 1 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.treeifyError(result.error)).toBeTruthy();
    }
  });

  it("should return false if the userId is not provided", () => {
    const result = profileSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.treeifyError(result.error)).toBeTruthy();
    }
  });
});
