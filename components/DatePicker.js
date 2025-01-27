"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "./UI/button";
import { Calendar } from "./UI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./UI/popover";

export function DatePicker({ onChange }) {
  const [date, setDate] = useState(Date.now());
  useEffect(() => {
    onChange(date);
  }, [date, onChange]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[190px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
