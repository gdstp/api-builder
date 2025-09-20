import SignInController from "@/controllers/sign-in.controller";
import UserRepository from "@/repositories/user.repository";
import Encrypter from "@/services/encrypter.service";
import { AppError } from "@/utils/app-error";
import { SIGN_IN_INPUT } from "__tests__/helpers/test-data";
import { describe, expect, it, vi } from "vitest";

describe("SignInController", () => {
  it("should sign in a user", async () => {
    const spy = vi
      .spyOn(Encrypter.prototype, "compare")
      .mockResolvedValueOnce(true);
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockResolvedValueOnce({
        ...SIGN_IN_INPUT,
        id: "1",
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    const user = await SignInController(SIGN_IN_INPUT);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(SIGN_IN_INPUT.email);
    expect(user.name).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      SIGN_IN_INPUT.password,
      SIGN_IN_INPUT.password,
    );
  });

  it("should throw AppError if UserRepository returns null and not call encrypter", async () => {
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockImplementationOnce(() => Promise.resolve(null));
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "compare");

    expect(SignInController(SIGN_IN_INPUT)).rejects.toEqual(
      new AppError("User not found", 404, "USER_NOT_FOUND"),
    );
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spyEncrypter).not.toHaveBeenCalled();
  });
});
