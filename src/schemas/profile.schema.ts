import { z } from "zod";

export const profileSchema = z.object({
  userId: z.string(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
