import z from "zod";

export const refreshTokenSchema = z.object({
  refreshToken: z.string("refresh token is a required field").min(1),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
