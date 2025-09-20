import { describe, it, expect, vi } from "vitest";
import Encrypter from "@/services/encrypter.service";
import { AppError } from "@/utils/app-error";

vi.mock("@/utils", () => ({
  requireEnv: vi.fn().mockReturnValue("4"),
}));

describe("EncrypterService", () => {
  let encrypter = new Encrypter();
  const password = "mySecretPassword123";

  describe("hash", () => {
    it("should hash password successfully", async () => {
      const hashedPassword = await encrypter.hash(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBe(60);
    });

    it("should throw an AppError if password is empty", async () => {
      const password = "";

      await expect(encrypter.hash(password)).rejects.toEqual(
        new AppError("Password is required", 400, "PASSWORD_REQUIRED"),
      );
    });

    it("should return different hashes for same passwords", async () => {
      const hashedPassword1 = await encrypter.hash(password);
      const hashedPassword2 = await encrypter.hash(password);

      expect(hashedPassword1).not.toBe(hashedPassword2);
    });
  });

  describe("compare", () => {
    it("should compare password successfully", async () => {
      const hashedPassword = await encrypter.hash(password);

      const result = encrypter.compare(password, hashedPassword);

      await expect(result).resolves.toBe(true);
    });

    it("should return false if password is incorrect", async () => {
      const hashedPassword = await encrypter.hash(password);

      const result = encrypter.compare("wrongPassword", hashedPassword);

      await expect(result).resolves.toBe(false);
    });

    it("should throw an AppError if password is empty", async () => {
      const password = "";

      await expect(encrypter.compare(password, "myHash")).rejects.toEqual(
        new AppError("Password is required", 400, "PASSWORD_REQUIRED"),
      );
    });

    it("should throw an AppError if hash is empty", async () => {
      await expect(encrypter.compare(password, "")).rejects.toEqual(
        new AppError("Hash is required", 400, "HASH_REQUIRED"),
      );
    });
  });
});
