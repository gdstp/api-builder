import SignUpController from "@/controllers/sign-up.controller";
import { prisma } from "@/lib/prisma";
import UserRepository from "@/repositories/user.repository";
import Encrypter from "@/services/encrypter.service";
import { Prisma } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => `"${model.dbName || model.name}"`,
  );

  const sql = `TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE;`;
  await prisma.$executeRawUnsafe(sql);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  await emptyDatabase();
});

describe("SignUpController", () => {
  it("should create a user", async () => {
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "hash");
    const spyUserRepository = vi.spyOn(UserRepository.prototype, "createUser");

    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      confirmPassword: "123456789",
    };

    const user = await SignUpController({
      name: input.name,
      email: input.email,
      password: input.password,
      confirmPassword: input.confirmPassword,
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(input.email);
    expect(user.name).toBe(input.name);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    expect(user).not.toHaveProperty("password");

    expect(spyEncrypter).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: expect.not.stringMatching(input.password),
    });
  });

  it("should throw if encrypter throws", async () => {
    const spyEncrypter = vi
      .spyOn(Encrypter.prototype, "hash")
      .mockRejectedValue(new Error("Hash error"));
    const spyUserRepository = vi.spyOn(UserRepository.prototype, "createUser");

    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      confirmPassword: "123456789",
    };

    await expect(SignUpController(input)).rejects.toThrow();
    expect(spyEncrypter).toHaveBeenCalledOnce();
    expect(spyUserRepository).not.toHaveBeenCalled();
  });

  it("should throw if user repository throws", async () => {
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "hash");
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "createUser")
      .mockRejectedValue(new Error("User repository error"));

    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      confirmPassword: "123456789",
    };

    await expect(SignUpController(input)).rejects.toThrow();
    expect(spyEncrypter).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: expect.not.stringMatching(input.password),
    });
  });
});
