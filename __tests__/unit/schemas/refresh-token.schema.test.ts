import { refreshTokenSchema } from "@/schemas/refresh-token.schema";
import { describe, expect, it } from "vitest";

describe("refreshTokenSchema", () => {
  it("should validate a valid refresh token input", () => {
    const validInput = {
      refreshToken: "valid.refresh.token",
    };

    const result = refreshTokenSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validInput);
    }
  });

  it("should reject when refreshToken is missing", () => {
    const invalidInput = {};

    const result = refreshTokenSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "refresh token is a required field",
      );
    }
  });

  it("should reject when refreshToken is empty string", () => {
    const invalidInput = {
      refreshToken: "",
    };

    const result = refreshTokenSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Too small: expected string to have >=1 characters",
      );
    }
  });

  it("should reject when refreshToken is not a string", () => {
    const invalidInput = {
      refreshToken: 12345,
    };

    const result = refreshTokenSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "refresh token is a required field",
      );
    }
  });

  it("should reject when refreshToken is null", () => {
    const invalidInput = {
      refreshToken: null,
    };

    const result = refreshTokenSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "refresh token is a required field",
      );
    }
  });
});
