"use server";

import { prisma } from "@/lib/prisma";
import { OverViewSchema } from "@/schema/overView";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(res) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(res.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryParams = OverViewSchema.safeParse({ to, from });

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 402 });
  }

  const categories = await getCategoriesStats({
    userId: user.id,
    from: queryParams.data.from,
    to: queryParams.data.to,
  });

  return Response.json(categories);
}

async function getCategoriesStats({ userId, from, to }) {
  const categories = await prisma.Transaction.groupBy({
    by: ["type", "Category", "CategoryIcon"],
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    _sum: { amount: true },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
  return categories;
}
