import { requireEnv } from "@/utils";
import { AppError } from "@/utils/app-error";
import jwt from "jsonwebtoken";

const JWT_SECRET = requireEnv("JWT_SECRET");

export default class TokenService {
  async generateToken(userId: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
    }

    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  }
}
