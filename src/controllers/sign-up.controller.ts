import UserRepository from "@/repositories/user.repository";
import { SignUpInput } from "@/schemas/sign-up.schema";
import Encrypter from "@/services/encrypter.service";
import { AppError } from "@/utils/AppError";

export default async function SignUpController(input: SignUpInput) {
  const encrypter = new Encrypter();
  const userRepository = new UserRepository();

  const hashedPassword = await encrypter.hash(input.password);

  const user = await userRepository.createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  if (!user) {
    throw new AppError("User not created", 500, "USER_NOT_CREATED");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
