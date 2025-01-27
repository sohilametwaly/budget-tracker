"use server";
import { prisma } from "@/lib/prisma";
import { CreateTransactionSchema } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(transaction) {
  const parsedBody = CreateTransactionSchema.safeParse(transaction);

  if (!parsedBody.success) {
    throw new Error("Invalid transaction credentials", transaction);
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, description, date, type } = parsedBody.data;

  await prisma.$transaction([
    prisma.Transaction.create({
      data: {
        userId: user.id,
        amount,
        Category: category.name,
        CategoryIcon: category.icon,
        description,
        date,
        type,
      },
    }),
    prisma.MonthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
    prisma.YearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
