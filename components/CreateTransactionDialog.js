"use client";

import { Button } from "./UI/button";
import { Input } from "./UI/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./UI/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/form";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoriesPicker } from "./CategoriesPicker";
import { CreateTransactionSchema } from "@/schema/transaction";
import { useCallback, useState } from "react";
import { DatePicker } from "./DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../app/(dashboard)/_actions/CreateTransaction";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { DatetoUtcDate } from "@/lib/helpers";

function CreateTransactionDialog({ trigger, type }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: Date.now(),
      description: "",
      amount: 0,
      category: {},
    },
  });

  const querClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction",
      });

      querClient.refetchQueries(["overview"]);
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create transaction. Please try again later.", {
        id: "create-transaction",
      });
    },
  });

  const onSubmit = useCallback(
    (transaction) => {
      mutate({ ...transaction, date: DatetoUtcDate(transaction.date) });
      toast.loading("Creating transaction...", { id: "create-transaction" });
    },
    [mutate]
  );

  const handleCategoryChange = useCallback(
    (value) => {
      form.setValue("category", value);
    },
    [form]
  );

  const handleDateChange = useCallback(
    (value) => {
      form.setValue("date", value);
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>{" "}
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input default="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input default={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            {form.watch("category").name}
            <div className="flex justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoriesPicker
                        type={type}
                        onChange={handleCategoryChange}
                        className={"w-full"}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction date</FormLabel>
                    <FormControl>
                      <DatePicker onChange={handleDateChange} />
                    </FormControl>
                    <FormDescription>
                      Select a date for this transaction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2Icon /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;
