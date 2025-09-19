import { requireEnv } from "@/utils";
import { AppError } from "@/utils/AppError";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(requireEnv("SALT_ROUNDS"), 10);

export default class Encrypter {
  async hash(password: string) {
    if (!password) {
      throw new AppError("Password is required", 400, "PASSWORD_REQUIRED");
    }
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string) {
    if (!password) {
      throw new AppError("Password is required", 400, "PASSWORD_REQUIRED");
    }

    if (!hash) {
      throw new AppError("Hash is required", 400, "HASH_REQUIRED");
    }

    return await bcrypt.compare(password, hash);
  }
}
