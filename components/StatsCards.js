import SkeletonWrapper from "./SkeletonWrapper";
import { Card } from "./UI/card";
import { DatetoUtcDate, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useCallback, useMemo } from "react";
import CountUp from "react-countup";

function StatsCards({ from, to, userSettings }) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DatetoUtcDate(from)}&to=${DatetoUtcDate(to)}`
      ).then((res) => res.json()),
  });

  //ensure the format will change if the cuurency changed only
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = statsQuery.data?.total || 0;

  return (
    <>
      <div className="relative flex flex-wrap gap-2 md:flex-nowrap">
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
          <StatsCard
            formatter={formatter}
            value={income}
            title={"Income"}
            icon={
              <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
            }
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
          <StatsCard
            formatter={formatter}
            value={expense}
            title={"Expense"}
            icon={
              <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10" />
            }
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
          <StatsCard
            formatter={formatter}
            value={balance}
            title={"Balance"}
            icon={
              <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
            }
          />
        </SkeletonWrapper>
      </div>
    </>
  );
}

export default StatsCards;

function StatsCard({ formatter, value, icon, title }) {
  const formatFn = useCallback(
    (value) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="w-full h-24 items-center flex gap-3 p-4">
      {icon}
      <div className="flex flex-col items-center gap-0">
        <p className="text-muted-foreground text-left text-xl">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
