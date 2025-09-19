import { describe, it, expect, vi, beforeEach } from "vitest";
import Encrypter from "@/services/encrypter.service";

vi.mock("@/utils", () => ({
  requireEnv: vi.fn().mockReturnValue("10"),
}));

describe("EncrypterService", () => {
  let encrypter: Encrypter;

  beforeEach(() => {
    encrypter = new Encrypter();
  });

  describe("hash", () => {
    it("should hash password successfully", async () => {
      const password = "mySecretPassword123";
      const hashedPassword = await encrypter.hash(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBe(60);
    });
  });

  describe("compare", () => {
    it("should compare password successfully", async () => {
      const password = "mySecretPassword123";
      const hashedPassword = await encrypter.hash(password);

      const result = encrypter.compare(password, hashedPassword);

      await expect(result).resolves.toBe(true);
    });

    it("should return false if password is incorrect", async () => {
      const password = "mySecretPassword123";
      const hashedPassword = await encrypter.hash(password);

      const result = encrypter.compare("wrongPassword", hashedPassword);

      await expect(result).resolves.toBe(false);
    });
  });
});
