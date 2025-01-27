const { MAX_DATE_RANGE_DAYS } = require("@/lib/Constants");
const { differenceInDays } = require("date-fns");
const { z } = require("zod");

export const OverViewSchema = z
  .object({
    to: z.coerce.date(),
    from: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);
    const isValidRange = days <= MAX_DATE_RANGE_DAYS && days >= 0;
    return isValidRange;
  });
