import TokenService from "@/services/token.service";
import { describe, expect, it } from "vitest";

describe("TokenService", () => {
  it("should generate a token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateToken("1");

    expect(token).toBeDefined();
  });
});
