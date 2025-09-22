import UserRepository from "@/repositories/user.repository";
import { ProfileInput } from "@/schemas/profile.schema";
import { AppError } from "@/utils/app-error";

export default async function ProfileController(input: ProfileInput) {
  const userRepository = new UserRepository();
  const user = await userRepository.getUserById(input.userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
}
