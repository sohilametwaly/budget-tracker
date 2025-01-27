import { prisma } from "@/lib/prisma";
import { HistoryPeriodSchema } from "@/schema/historyPeriod";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const paramTimeFrame = searchParams.get("timeFrame");
  const paramYear = searchParams.get("year");
  const paramMonth = searchParams.get("month");
  const queryParams = HistoryPeriodSchema.safeParse({
    timeFrame: paramTimeFrame,
    month: paramMonth,
    year: paramYear,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const { timeFrame, month, year } = queryParams.data;

  let transactions;
  if (timeFrame === "month") {
    transactions = await getMonthHistoryData(year, month, user.id);
  } else {
    transactions = await getYearHistoryData(user.id, year);
  }

  return Response.json(transactions);
}

async function getYearHistoryData(userId, year) {
  const result = await prisma.YearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (!result || result.length == 0) {
    return [];
  }
  const history = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const month = result.find((res) => res.month == i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }
  return history;
}

async function getMonthHistoryData(year, month, userId) {
  const result = await prisma.MonthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length == 0) {
    return [];
  }

  const history = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;
    const day = result.find((res) => res.day == i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }
    history.push({
      year,
      month,
      day: i,
      expense,
      income,
    });
  }
  return history;
}
