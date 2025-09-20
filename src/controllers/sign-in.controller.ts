import UserRepository from "@/repositories/user.repository";
import { SignInInput } from "@/schemas/sign-in.schema";
import Encrypter from "@/services/encrypter.service";
import TokenService from "@/services/token.service";
import { AppError } from "@/utils/app-error";

export default async function SignInController(input: SignInInput) {
  const userRepository = new UserRepository();
  const encrypter = new Encrypter();
  const tokenService = new TokenService();
  const user = await userRepository.getUserByEmail(input.email);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const isPasswordValid = await encrypter.compare(
    input.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401, "INVALID_PASSWORD");
  }

  const token = await tokenService.generateToken(user.id);

  if (!token) {
    throw new AppError(
      "Failed to generate token",
      500,
      "FAILED_TO_GENERATE_TOKEN",
    );
  }

  return {
    user,
    token,
  };
}
