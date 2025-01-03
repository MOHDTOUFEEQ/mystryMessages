import { z } from "zod";



export const signInSchema = z.object({
  identifier: z.string().min(3).max(40),
  password: z.string(),
});