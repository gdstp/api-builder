import { describe, expect, it, vi } from "vitest";
import { afterEach, beforeEach } from "node:test";
import UserRepository from "@/repositories/user.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("UserRepository", () => {
  const userRepository = new UserRepository();
  const mockedPrisma = prisma as any;

  it("should create a user", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
    };

    const expectedOutput = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockedPrisma.user.create.mockResolvedValue(expectedOutput);

    const user = await userRepository.createUser(input);

    expect(mockedPrisma.user.create).toHaveBeenCalledOnce();
    expect(mockedPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });
    expect(user).toEqual(expectedOutput);
  });

  it("should throw an error if the user already exists", async () => {
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
    };

    mockedPrisma.user.create
      .mockResolvedValueOnce({
        ...input,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockRejectedValueOnce(
        Object.assign({
          code: "P2002",
        }),
      );

    await userRepository.createUser(input);

    await expect(userRepository.createUser(input)).rejects.toHaveProperty(
      "code",
      "P2002",
    );

    expect(mockedPrisma.user.create).toHaveBeenCalledTimes(2);
  });
});
