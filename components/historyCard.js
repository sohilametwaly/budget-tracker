"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Months } from "@/lib/Constants";
import BarChartComponent from "./BarChart";
import { GetFormatterForCurrency } from "@/lib/helpers";

function HistoryCard({ userSettings }) {
  const [timeFrame, setTimeFrame] = useState("month");
  const [period, setPeriod] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const years = useQuery({
    queryKey: ["overview"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });

  const transactions = useQuery({
    queryKey: ["overview", "history", period.month, period.year, timeFrame],
    queryFn: () =>
      fetch(
        `/api/history-data?year=${period.year}&month=${period.month}&timeFrame=${timeFrame}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const dataAvailable = transactions.data && transactions.data.length > 0;

  return (
    <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value)}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="grid grid-flow-row justify-between gap-2 min-[1020px]:grid-flow-col">
              <div className="flex justify-between gap-1 md:gap-10">
                <SkeletonWrapper isLoading={years.isFetching} fullWidth={false}>
                  <TabsList>
                    <TabsTrigger value="year">Year</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </SkeletonWrapper>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SkeletonWrapper isLoading={years.isFetching}>
                  <YearSelector
                    years={years.data || []}
                    period={period}
                    setPeriod={setPeriod}
                  />
                  {timeFrame == "month" && (
                    <MonthSelector period={period} setPeriod={setPeriod} />
                  )}
                </SkeletonWrapper>
              </div>
              <div className="flex h-10 gap-2">
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                  Income
                </Badge>
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  Expense
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={transactions.isFetching}>
            <TabsContent value="year">
              {!dataAvailable && (
                <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                  No data for the selected period
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different period or adding new transaction
                  </p>
                </Card>
              )}
              {dataAvailable && (
                <BarChartComponent
                  data={transactions.data}
                  timeFrame={timeFrame}
                  formatter={formatter}
                />
              )}
            </TabsContent>
            <TabsContent value="month">
              {!dataAvailable && (
                <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                  No data for the selected period
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different period or adding new transaction
                  </p>
                </Card>
              )}
              {dataAvailable && (
                <BarChartComponent
                  data={transactions.data}
                  timeFrame={timeFrame}
                  formatter={formatter}
                />
              )}
            </TabsContent>
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </Tabs>
  );
}

export default HistoryCard;

export function YearSelector({ years, period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(period.year);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedYear ? selectedYear : `Select year...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {years.map((year) => (
                <CommandItem
                  key={year}
                  value={year}
                  onSelect={(currentValue) => {
                    setSelectedYear(currentValue);
                    setPeriod((prev) => ({
                      month: prev.month,
                      year: currentValue,
                    }));
                    setOpen(false);
                  }}
                >
                  {year}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedYear === year ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function MonthSelector({ period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(period.month);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedMonth != undefined
            ? Months.find((month) => month.value == selectedMonth)?.label
            : `Select month...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No month found.</CommandEmpty>
            <CommandGroup>
              {Months.map((month) => (
                <CommandItem
                  key={month.value}
                  value={month.value}
                  onSelect={(currentValue) => {
                    setSelectedMonth(month.value);
                    setPeriod((prev) => ({
                      year: prev.year,
                      month: month.value,
                    }));
                    setOpen(false);
                  }}
                >
                  {month.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedMonth === month.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
