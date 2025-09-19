import { requireEnv } from "@/utils";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(requireEnv("SALT_ROUNDS"), 10);

export default class Encrypter {
  async hash(password: string) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
