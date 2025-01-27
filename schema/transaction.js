import { z } from "zod";

export const CreateTransactionSchema = z.object({
  type: z.union([z.literal("income"), z.literal("expense")]),
  amount: z.coerce.number().positive().multipleOf(0.01),
  category: z.object({ name: z.string(), icon: z.string() }),
  description: z.string().optional(),
  date: z.coerce.date(),
});
