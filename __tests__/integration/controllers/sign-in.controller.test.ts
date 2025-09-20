import SignInController from "@/controllers/sign-in.controller";
import Encrypter from "@/services/encrypter.service";
import { SIGN_IN_INPUT } from "__tests__/helpers/test-data";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(() => ({
        ...SIGN_IN_INPUT,
        id: "1",
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    },
  },
}));

describe("SignInController", () => {
  it("should sign in a user", async () => {
    const spy = vi
      .spyOn(Encrypter.prototype, "compare")
      .mockResolvedValueOnce(true);
    const user = await SignInController(SIGN_IN_INPUT);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(SIGN_IN_INPUT.email);
    expect(user.name).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      SIGN_IN_INPUT.password,
      SIGN_IN_INPUT.password,
    );
  });
});
