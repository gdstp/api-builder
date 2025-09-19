import { SignUpInput } from "@/schemas/signUp.schema";

export default async function SignUpController(input: SignUpInput) {
  return {
    name: input.name,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };
}
