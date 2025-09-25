import UserRepository from "@/repositories/user.repository";
import { RefreshTokenInput } from "@/schemas/refresh-token.schema";
import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export default async function RefreshTokenController(input: RefreshTokenInput) {
  const tokenService = new TokenService();
  const userRepository = new UserRepository();

  try {
    const decoded = tokenService.verifyRefreshToken(
      input.refreshToken,
    ) as TokenPayload;

    const user = await userRepository.getUserById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const newAccessToken = await tokenService.generateAccessToken(user.id);
    const newRefreshToken = await tokenService.generateRefreshToken(user.id);

    if (!newAccessToken || !newRefreshToken) {
      throw new AppError(
        "Failed to generate tokens",
        500,
        "FAILED_TO_GENERATE_TOKEN",
      );
    }

    const { password: _password, ...userInfo } = user;

    return {
      user: userInfo,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError("Refresh token expired", 401, "REFRESH_TOKEN_EXPIRED");
    }

    if (error instanceof JsonWebTokenError) {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Token verification failed",
      500,
      "TOKEN_VERIFICATION_FAILED",
    );
  }
}
