import ProfileController from "@/controllers/profile.controller";
import UserRepository from "@/repositories/user.repository";
import { USER_REPOSITORY_GET_USER_BY_ID_RETURN } from "__tests__/helpers/test-data";
import { describe, expect, it, vi } from "vitest";

describe("ProfileController", () => {
  it("should return a user", async () => {
    const spyUserRepository = vi.spyOn(UserRepository.prototype, "getUserById");
    spyUserRepository.mockResolvedValueOnce(
      USER_REPOSITORY_GET_USER_BY_ID_RETURN,
    );
    const user = await ProfileController({ userId: "2" });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(USER_REPOSITORY_GET_USER_BY_ID_RETURN.email);
    expect(user.name).toBe(USER_REPOSITORY_GET_USER_BY_ID_RETURN.name);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    expect(spyUserRepository).toHaveBeenCalledOnce();
    expect(spyUserRepository).toHaveBeenCalledWith("2");
  });
});
