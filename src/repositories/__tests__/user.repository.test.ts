import { afterAll, describe, expect, it } from "vitest";
import UserRepository from "../user.repository";
import { prisma } from "@/lib/prisma";

afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("UserRepository", () => {
  it("should create a user", async () => {
    const userRepository = new UserRepository();
    const user = await userRepository.createUser({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
