import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string("name is a required field").min(1),
    email: z.email(),
    password: z.string("password is required field").min(8),
    confirmPassword: z.string("confirmPassword is required field").min(8),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "invalid_type",
        message: "Passwords do not match.",
        expected: "string",
        path: ["confirmPassword"],
      });
    }
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
