import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string("name is a required field").min(1),
    email: z.email(),
    password: z.string("password is required field").min(8),
    confirmPassword: z.string("confirmPassword is required field").min(8),
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
