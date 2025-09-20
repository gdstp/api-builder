import { signUpSchema } from "@/schemas/sign-up.schema";
import { describe, expect, it } from "vitest";

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
});
