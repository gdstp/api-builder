import SignUpController from "@/controllers/sign-up.controller";
import UserRepository from "@/repositories/user.repository";
import Encrypter from "@/services/encrypter.service";
import { SIGN_UP_INPUT } from "__tests__/helpers/test-data";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(() => ({
        ...SIGN_UP_INPUT,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    },
  },
}));

beforeEach(async () => {
  vi.clearAllMocks();
});

describe("SignUpController", () => {
  const input = SIGN_UP_INPUT;

  it("should create a user", async () => {
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "hash");
    const spyUserRepository = vi.spyOn(UserRepository.prototype, "createUser");

    const user = await SignUpController(input);

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

    await expect(SignUpController(input)).rejects.toThrow();
    expect(spyEncrypter).toHaveBeenCalledOnce();
    expect(spyUserRepository).not.toHaveBeenCalled();
  });

  it("should throw if user repository throws", async () => {
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "hash");
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "createUser")
      .mockRejectedValue(new Error("User repository error"));

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
