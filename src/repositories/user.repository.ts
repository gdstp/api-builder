import { prisma } from "@/lib/prisma";
import { SignUpInput } from "@/schemas/sign-up.schema";

export default class UserRepository {
  async createUser(input: Omit<SignUpInput, "confirmPassword">) {
    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });

    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
