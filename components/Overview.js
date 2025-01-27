"use client";

import { DatePickerWithRange } from "./DateRangePicker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/Constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./categoriesStats";
import HistoryCard from "./historyCard";

function Overview({ userSettings }) {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const handleDateChange = useCallback(
    (selectedDateRange) => {
      if (!selectedDateRange) return;
      if (
        differenceInDays(selectedDateRange.to, selectedDateRange.from) >
        MAX_DATE_RANGE_DAYS
      ) {
        toast.error(
          `Date range cannot exceed 3 months(${MAX_DATE_RANGE_DAYS} days). Please select a shorter range.`
        );
        return;
      }
      setDateRange(selectedDateRange);
    },
    [setDateRange]
  );
  return (
    <>
      <div className="container flex flex-wrap items-end justify-between py-6 gap-2  w-[90%] sm:w-[95%]">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DatePickerWithRange
            onChange={handleDateChange}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
          />
        </div>
      </div>
      <div className="container flex flex-col gap-2 w-[98%] md:w-[90%]">
        <StatsCards
          userSettings={userSettings}
          to={dateRange.to}
          from={dateRange.from}
        />
        <CategoriesStats
          userSettings={userSettings}
          to={dateRange.to}
          from={dateRange.from}
        />
      </div>
      <div className="container flex flex-col  gap-2 w-[98%] md:w-[90%] py-6">
        <p className="text-3xl font-bold ">History</p>
        <HistoryCard userSettings={userSettings} />
      </div>
    </>
  );
}

export default Overview;
