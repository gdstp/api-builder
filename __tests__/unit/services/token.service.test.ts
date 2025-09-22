import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";
import { describe, expect, it } from "vitest";

describe("TokenService", () => {
  it("should generate a access token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateAccessToken("1");

    expect(token).toBeDefined();
  });

  it("should throw an error if user id is not provided to generate access token", async () => {
    const tokenService = new TokenService();

    await expect(tokenService.generateAccessToken("")).rejects.toEqual(
      new AppError("User ID is required", 400, "USER_ID_REQUIRED"),
    );
  });

  it("should generate a refresh token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateRefreshToken("1");

    expect(token).toBeDefined();
  });

  it("should throw an error if user id is not provided to generate refresh token", async () => {
    const tokenService = new TokenService();

    await expect(tokenService.generateRefreshToken("")).rejects.toEqual(
      new AppError("User ID is required", 400, "USER_ID_REQUIRED"),
    );
  });

  it("should verify a access token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateAccessToken("1");

    const decoded = tokenService.verifyAccessToken(token);

    expect(decoded).toBeDefined();
  });

  it("should verify a refresh token", async () => {
    const tokenService = new TokenService();
    const token = await tokenService.generateRefreshToken("1");

    const decoded = tokenService.verifyRefreshToken(token);

    expect(decoded).toBeDefined();
  });
});
