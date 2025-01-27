import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await prisma.MonthHistory.findMany({
    where: {
      userId: user.id,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  const years = result.map((year) => year.year);
  if (years.length === 0) {
    return Response.json([new Date().getFullYear()]);
  }

  return Response.json(years);
}
