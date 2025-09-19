import { prisma } from "@/lib/prisma";
import { SignUpInput } from "@/schemas/signUp.schema";

class UserRepository {
  async createUser(input: SignUpInput) {
    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });

    return newUser;
  }
}

export default new UserRepository();
