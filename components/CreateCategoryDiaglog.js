"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./UI/form";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategorySchema } from "@/schema/categories";
import { CircleOff, SquarePlus, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger } from "./UI/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { CreateCategoryfn } from "@/app/(dashboard)/_actions/CreateCategory";
import { useTheme } from "next-themes";

function CreateCategory({ type, successCallBack, className }) {
  const [open, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
      icon: "",
      name: "",
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategoryfn,
    onSuccess: async (data) => {
      form.reset({
        icon: "",
        name: "",
        type,
      });
      toast.success(`Category  created successfully 🎉`, {
        id: "create-category",
      });

      successCallBack(data);

      queryClient.refetchQueries({
        queries: [{ queryKey: ["categories", "overview"] }],
      });

      setIsOpen((prev) => !prev);
    },
    onError: (e) => {
      toast.error("Failed to create category", {
        id: "create-category",
      });
    },
  });

  const onSumbit = useCallback(
    (values) => {
      toast.loading("Creating category...", { id: "create-category" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <SquarePlus /> Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8 z-40"
            onSubmit={form.handleSubmit(onSumbit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input default="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span role="img" className="text-5xl">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[68px] w-[68px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full relative top-20">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji) =>
                            field.onChange(emoji.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategory;
