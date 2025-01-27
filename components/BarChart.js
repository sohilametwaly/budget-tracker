import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartComponent({ data, timeFrame, formatter }) {
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart
        data={data}
        height={300}
        barCategoryGap={5}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="incomeBar" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#10b981" stopOpacity={1} />
            <stop offset={1} stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseBar" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#ef4444" stopOpacity={1} />
            <stop offset={1} stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray={"10 10"}
          strokeOpacity={"0.2"}
          vertical={false}
        />
        <XAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 5, right: 5 }}
          dataKey={(data) => {
            const { year, month, day } = data;
            const date = new Date(year, month, day || 1);
            if (timeFrame == "year") {
              return date.toLocaleDateString("default", {
                month: "long",
              });
            }
            return date.toLocaleDateString("default", { day: "2-digit" });
          }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Bar
          dataKey={"income"}
          label="Income"
          fill="url(#incomeBar)"
          radius={10}
          className="cursor-pointer"
        />
        <Bar
          dataKey={"expense"}
          label="Expense"
          fill="url(#expenseBar)"
          radius={10}
          className="cursor-pointer"
        />
        <Tooltip
          cursor={{ opacity: 0.1 }}
          content={<CustomToolTip formatter={formatter} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomToolTip({ active, payload, formatter }) {
  if (!active || !payload || payload.length == 0) return null;
  const data = payload[0].payload;
  const { expense, income } = data;
  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <ToolTipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <ToolTipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <ToolTipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
}

function ToolTipRow({ formatter, label, value, bgColor, textColor }) {
  const formattingFn = useCallback(
    (value) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <div className="items-center flex gap-2">
      <div className={cn("h-4 w-4 rounded-full ", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold ", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimal="0"
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
