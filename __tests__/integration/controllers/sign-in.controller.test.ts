import SignInController from "@/controllers/sign-in.controller";
import UserRepository from "@/repositories/user.repository";
import Encrypter from "@/services/encrypter.service";
import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";
import {
  SIGN_IN_INPUT,
  USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN,
} from "__tests__/helpers/test-data";
import { describe, expect, it, vi } from "vitest";

describe("SignInController", () => {
  it("should sign in a user", async () => {
    const spy = vi
      .spyOn(Encrypter.prototype, "compare")
      .mockResolvedValueOnce(true);
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockResolvedValueOnce(USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN);
    const spyTokenService = vi.spyOn(TokenService.prototype, "generateToken");
    const data = await SignInController(SIGN_IN_INPUT);

    expect(data.user).toHaveProperty("id");
    expect(data.user.email).toBe(SIGN_IN_INPUT.email);
    expect(data.user.name).toBeDefined();
    expect(data.user.createdAt).toBeInstanceOf(Date);
    expect(data.user.updatedAt).toBeInstanceOf(Date);

    expect(data.token).toBeDefined();

    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      SIGN_IN_INPUT.password,
      SIGN_IN_INPUT.password,
    );
    expect(spyTokenService).toHaveBeenCalledOnce();
    expect(spyTokenService).toHaveBeenCalledWith(
      USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN.id,
    );
  });

  it("should throw AppError if UserRepository returns null and not call encrypter", async () => {
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockImplementationOnce(() => Promise.resolve(null));
    const spyEncrypter = vi.spyOn(Encrypter.prototype, "compare");

    await expect(SignInController(SIGN_IN_INPUT)).rejects.toEqual(
      new AppError("User not found", 404, "USER_NOT_FOUND"),
    );
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spyEncrypter).not.toHaveBeenCalled();
  });

  it("should throw AppError if encrypter returns false", async () => {
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockImplementationOnce(() =>
        Promise.resolve(USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN),
      );
    const spyEncrypter = vi
      .spyOn(Encrypter.prototype, "compare")
      .mockResolvedValueOnce(false);

    await expect(SignInController(SIGN_IN_INPUT)).rejects.toEqual(
      new AppError("Invalid password", 401, "INVALID_PASSWORD"),
    );
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spyEncrypter).toHaveBeenCalledOnce();
    expect(spyEncrypter).toHaveBeenCalledWith(
      SIGN_IN_INPUT.password,
      USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN.password,
    );
  });

  it("should throw AppError if token service returns invalid token", async () => {
    const spyUserRepository = vi
      .spyOn(UserRepository.prototype, "getUserByEmail")
      .mockImplementationOnce(() =>
        Promise.resolve(USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN),
      );
    vi.spyOn(Encrypter.prototype, "compare").mockResolvedValueOnce(true);

    const spyTokenService = vi
      .spyOn(TokenService.prototype, "generateToken")
      .mockResolvedValueOnce("");

    await expect(SignInController(SIGN_IN_INPUT)).rejects.toEqual(
      new AppError("Failed to generate token", 500, "FAILED_TO_GENERATE_TOKEN"),
    );
    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith(SIGN_IN_INPUT.email);
    expect(spyTokenService).toHaveBeenCalledOnce();
    expect(spyTokenService).toHaveBeenCalledWith(
      USER_REPOSITORY_GET_USER_BY_EMAIL_RETURN.id,
    );
  });
});
