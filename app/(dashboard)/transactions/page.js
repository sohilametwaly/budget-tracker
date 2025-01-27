"use client";

import { DatePickerWithRange } from "@/components/DateRangePicker";
import { startOfMonth } from "date-fns";
import { useCallback, useState } from "react";
import TransactionsTable from "../../../components/TransactionsTable";

function TransactionsPage() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const onDateChange = useCallback((value) => {
    if (value) setDateRange(value);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className=" flex justify-between p-6 px-10 border-b w-full">
        <p className="text-3xl font-bold">Transactions History</p>
        <DatePickerWithRange
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          onChange={onDateChange}
        />
      </div>
      <div className="w-[90%] m-auto">
        <TransactionsTable to={dateRange.to} from={dateRange.from} />
      </div>
    </div>
  );
}

export default TransactionsPage;
