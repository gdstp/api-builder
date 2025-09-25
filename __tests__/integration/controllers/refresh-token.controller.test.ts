import RefreshTokenController from "@/controllers/refresh-token.controller";
import UserRepository from "@/repositories/user.repository";
import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

const MOCK_REFRESH_TOKEN_INPUT = {
  refreshToken: "valid-refresh-token",
};

const MOCK_TOKEN_PAYLOAD = {
  userId: "user-123",
  iat: 1234567890,
  exp: 1234567890 + 86400,
};

const MOCK_USER = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  password: "hashed-password",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("RefreshTokenController", () => {
  it("should refresh tokens successfully", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockReturnValueOnce(MOCK_TOKEN_PAYLOAD);

    const spyGetUserById = vi
      .spyOn(UserRepository.prototype, "getUserById")
      .mockResolvedValueOnce(MOCK_USER);

    const spyGenerateAccessToken = vi
      .spyOn(TokenService.prototype, "generateAccessToken")
      .mockResolvedValueOnce("new-access-token");

    const spyGenerateRefreshToken = vi
      .spyOn(TokenService.prototype, "generateRefreshToken")
      .mockResolvedValueOnce("new-refresh-token");

    const result = await RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT);

    expect(result.user).toEqual({
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      createdAt: MOCK_USER.createdAt,
      updatedAt: MOCK_USER.updatedAt,
    });
    expect(result.user).not.toHaveProperty("password");
    expect(result.token).toBe("new-access-token");
    expect(result.refreshToken).toBe("new-refresh-token");

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyVerifyRefreshToken).toHaveBeenCalledWith(
      MOCK_REFRESH_TOKEN_INPUT.refreshToken,
    );
    expect(spyGetUserById).toHaveBeenCalledOnce();
    expect(spyGetUserById).toHaveBeenCalledWith(MOCK_TOKEN_PAYLOAD.userId);
    expect(spyGenerateAccessToken).toHaveBeenCalledOnce();
    expect(spyGenerateAccessToken).toHaveBeenCalledWith(MOCK_USER.id);
    expect(spyGenerateRefreshToken).toHaveBeenCalledOnce();
    expect(spyGenerateRefreshToken).toHaveBeenCalledWith(MOCK_USER.id);
  });

  it("should throw AppError when refresh token is expired", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockImplementationOnce(() => {
        throw new TokenExpiredError("jwt expired", new Date());
      });

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(
      new AppError("Refresh token expired", 401, "REFRESH_TOKEN_EXPIRED"),
    );

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyVerifyRefreshToken).toHaveBeenCalledWith(
      MOCK_REFRESH_TOKEN_INPUT.refreshToken,
    );
  });

  it("should throw AppError when refresh token is invalid", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockImplementationOnce(() => {
        throw new JsonWebTokenError("invalid token");
      });

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(
      new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN"),
    );

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyVerifyRefreshToken).toHaveBeenCalledWith(
      MOCK_REFRESH_TOKEN_INPUT.refreshToken,
    );
  });

  it("should throw AppError when user is not found", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockReturnValueOnce(MOCK_TOKEN_PAYLOAD);

    const spyGetUserById = vi
      .spyOn(UserRepository.prototype, "getUserById")
      .mockResolvedValueOnce(null);

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(new AppError("User not found", 404, "USER_NOT_FOUND"));

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyVerifyRefreshToken).toHaveBeenCalledWith(
      MOCK_REFRESH_TOKEN_INPUT.refreshToken,
    );
    expect(spyGetUserById).toHaveBeenCalledOnce();
    expect(spyGetUserById).toHaveBeenCalledWith(MOCK_TOKEN_PAYLOAD.userId);
  });

  it("should throw AppError when generateAccessToken fails", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockReturnValueOnce(MOCK_TOKEN_PAYLOAD);

    const spyGetUserById = vi
      .spyOn(UserRepository.prototype, "getUserById")
      .mockResolvedValueOnce(MOCK_USER);

    const spyGenerateAccessToken = vi
      .spyOn(TokenService.prototype, "generateAccessToken")
      .mockResolvedValueOnce("");

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(
      new AppError(
        "Failed to generate tokens",
        500,
        "FAILED_TO_GENERATE_TOKEN",
      ),
    );

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyGetUserById).toHaveBeenCalledOnce();
    expect(spyGenerateAccessToken).toHaveBeenCalledOnce();
  });

  it("should throw AppError when generateRefreshToken fails", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockReturnValueOnce(MOCK_TOKEN_PAYLOAD);

    const spyGetUserById = vi
      .spyOn(UserRepository.prototype, "getUserById")
      .mockResolvedValueOnce(MOCK_USER);

    const spyGenerateAccessToken = vi
      .spyOn(TokenService.prototype, "generateAccessToken")
      .mockResolvedValueOnce("new-access-token");

    const spyGenerateRefreshToken = vi
      .spyOn(TokenService.prototype, "generateRefreshToken")
      .mockResolvedValueOnce("");

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(
      new AppError(
        "Failed to generate tokens",
        500,
        "FAILED_TO_GENERATE_TOKEN",
      ),
    );

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
    expect(spyGetUserById).toHaveBeenCalledOnce();
    expect(spyGenerateAccessToken).toHaveBeenCalledOnce();
    expect(spyGenerateRefreshToken).toHaveBeenCalledOnce();
  });

  it("should handle unexpected errors", async () => {
    const spyVerifyRefreshToken = vi
      .spyOn(TokenService.prototype, "verifyRefreshToken")
      .mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

    await expect(
      RefreshTokenController(MOCK_REFRESH_TOKEN_INPUT),
    ).rejects.toEqual(
      new AppError(
        "Token verification failed",
        500,
        "TOKEN_VERIFICATION_FAILED",
      ),
    );

    expect(spyVerifyRefreshToken).toHaveBeenCalledOnce();
  });
});
