import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";
import { describe, expect, it } from "vitest";

describe("TokenService", () => {
  it("should generate a token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateToken("1");

    expect(token).toBeDefined();
  });

  it("should throw an error if user id is not provided", async () => {
    const tokenService = new TokenService();

    await expect(tokenService.generateToken("")).rejects.toEqual(
      new AppError("User ID is required", 400, "USER_ID_REQUIRED"),
    );
  });
});
