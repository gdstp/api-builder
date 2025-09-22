import { requireEnv } from "@/utils";
import { AppError } from "@/utils/app-error";
import jwt from "jsonwebtoken";

const JWT_SECRET = requireEnv("JWT_SECRET");
const REFRESH_JWT_SECRET = requireEnv("REFRESH_JWT_SECRET");

export default class TokenService {
  async generateAccessToken(userId: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
    }

    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  }

  async generateRefreshToken(userId: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
    }

    return jwt.sign({ userId }, REFRESH_JWT_SECRET, { expiresIn: "1d" });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_JWT_SECRET);
  }
}
