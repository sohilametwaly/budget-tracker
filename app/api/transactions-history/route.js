import { GetFormatterForCurrency } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const fromParams = searchParams.get("from");
  const toParams = searchParams.get("to");

  const validator = z.object({
    to: z.coerce.date(),
    from: z.coerce.date(),
  });

  const queryParams = validator.safeParse({ to: toParams, from: fromParams });

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const { to, from } = queryParams.data;

  const userSettings = await prisma.User.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const result = await prisma.Transaction.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: from, lte: to },
    },
    select: {
      id: true,
      amount: true,
      type: true,
      date: true,
      description: true,
      CategoryIcon: true,
      Category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const transactions = result.map((transaction) => ({
    ...transaction,
    amount: formatter.format(transaction.amount),
  }));

  return Response.json(transactions);
}
