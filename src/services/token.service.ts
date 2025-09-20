import { requireEnv } from "@/utils";
import jwt from "jsonwebtoken";

const JWT_SECRET = requireEnv("JWT_SECRET");

export default class TokenService {
  async generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  }
}
