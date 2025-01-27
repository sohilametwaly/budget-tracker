import { prisma } from "@/lib/prisma";
import { OverViewSchema } from "@/schema/overView";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverViewSchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats, { status: 200 });
}

async function getBalanceStats(userId, from, to) {
  const totals = await prisma.Transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: { gte: new Date(from), lte: new Date(to) },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
    total: totals.reduce(
      (acc, curr) =>
        curr.type === "income"
          ? acc + curr._sum.amount
          : acc - curr._sum.amount,
      0
    ),
  };
}
