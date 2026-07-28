import { z } from "zod"

export const loginFormSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
