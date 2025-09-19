import userRepository from "@/repositories/user.repository";
import { SignUpInput } from "@/schemas/signUp.schema";
import { AppError } from "@/utils/AppError";

export default async function SignUpController(input: SignUpInput) {
  const user = await userRepository.createUser(input);

  if (!user) {
    throw new AppError("User not created", 500, "USER_NOT_CREATED");
  }

  return user;
}
