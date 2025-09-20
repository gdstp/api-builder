import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string("password is a required field").min(8),
});

export type SignInInput = z.infer<typeof signInSchema>;
