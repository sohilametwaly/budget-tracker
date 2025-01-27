import SkeletonWrapper from "./SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "./UI/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { Progress } from "./UI/progress";
import { ScrollArea } from "./UI/scroll-area";

function CategoriesStats({ userSettings, to, from }) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", to, from],
    queryFn: () =>
      fetch(`/api/stats/categories?to=${to}&from=${from}`).then((res) =>
        res.json()
      ),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="conatiner flex gap-3 flex-wrap w-full md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isPending}>
        <CategoryCard
          type={"Income"}
          categories={statsQuery.data || []}
          formatter={formatter}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isPending}>
        <CategoryCard
          type={"Expense"}
          categories={statsQuery.data || []}
          formatter={formatter}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoryCard({ type, categories, formatter }) {
  const filteredData = categories.filter(
    (cat) => cat.type == type.toLowerCase()
  );

  const totalAmount = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type}s by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length == 0 && (
          <div className="flex h-60 w-full flex-col justify-center items-center">
            <p>No data for the selected period.</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new{" "}
              {type.toLowerCase()}s
            </p>
          </div>
        )}
        {filteredData.length != 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex flex-col w-full gap-4 p-4 ">
              {filteredData.map((item) => {
                const amount = item._sum?.amount || 0;
                const percentage = (amount * 100) / (totalAmount || amount);

                return (
                  <div key={item.Category} className="flex flex-col gap-2 ">
                    <div className="flex justify-between px-8">
                      <p className="text-muted-foreground text-[18px]">
                        {item.CategoryIcon} {item.Category}
                        {"  "}
                        <span className="text-xs">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </p>
                      <p className="text-muted-foreground textt-sm">
                        {formatter.format(amount)}
                      </p>
                    </div>
                    <ProgressBar
                      value={percentage.toFixed(0)}
                      indicator={
                        type.toLowerCase() == "income"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}

function ProgressBar({ value, indicator }) {
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Progress
      value={progress}
      className="w-[90%] bg-gray-500 self-center "
      indicatorClassName={indicator}
    />
  );
}
