import { z } from "zod";

export const HistoryPeriodSchema = z.object({
  timeFrame: z.enum(["month", "year"]),

  month: z.coerce.number().max(11).min(0).default(0),
  year: z.coerce.number().min(2000).max(new Date().getFullYear()),
});
