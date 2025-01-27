"use client";
import CreateCategory from "./CreateCategoryDiaglog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./UI/card";
import ConfirmationWizard from "./ConfirmationWizard";
import { Trash2 } from "lucide-react";
import { Button } from "./UI/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function CategoriesCard({ categoryType, categoryIcon }) {
  const [data, setData] = useState([]);
  const categories = useQuery({
    queryKey: ["categories", "overview"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });

  useEffect(() => {
    if (categories.data)
      setData(
        categories.data.filter(
          (category) => category.type == categoryType.toLowerCase()
        )
      );
  }, [categories.data, categoryType]);

  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationKey: "deleteCategory",
    mutationFn: ({ type, name }) => {
      fetch(`/api/categories?type=${type}&name=${name}`, { method: "DELETE" });
    },
    onSuccess: (data) => {
      toast.success(`Category deleted successfully 🎉`, {
        id: "delete-category",
      });
      queryClient.refetchQueries({
        queries: [{ queryKey: ["categories", "overview"] }],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error("Failed to delete category", {
        id: "delete-category",
      });
    },
  });

  const deleteCategoryHandler = useCallback(
    (type, name) => {
      if (name && type) {
        deleteCategory.mutate({ type, name });
        toast.loading(`Deleting ${name}...`, { id: "delete-category" });
      }
    },
    [deleteCategory]
  );

  return (
    <SkeletonWrapper isLoading={categories.isFetching}>
      <Card className="w-full flex flex-col gap-3 mb-3">
        <CardHeader className="flex flex-row justify-between border-b">
          <div className="flex gap-2">
            {categoryIcon}
            <div>
              <CardTitle> {categoryType} categories</CardTitle>
              <CardDescription>Sorted by name</CardDescription>
            </div>
          </div>
          <CreateCategory
            type={categoryType.toLowerCase()}
            successCallBack={(data) => {
              console.log(data);
            }}
            className={"w-[120px]"}
          />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 w-full">
            {data.length == 0 && (
              <div className="flex flex-col items-center justify-center py-8 w-full h-full text-center">
                <p>
                  No{" "}
                  <span
                    className={cn(
                      categoryType == "income"
                        ? "text-emerald-500"
                        : "text-red-500"
                    )}
                  >
                    {categoryType.toLowerCase()}
                  </span>{" "}
                  categories yet
                </p>
                <p className="text-muted-foreground">
                  Create one to get started
                </p>
              </div>
            )}
            <div className="w-full grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.length > 0 &&
                data.map((category) => {
                  return (
                    <Card
                      key={category.name}
                      className="w-full h-[150px] flex flex-col items-center justify-between gap-2"
                    >
                      <div className="items-center flex flex-col justify-center p-4 gap-3">
                        <CardTitle className="self-center">
                          {category.icon}
                        </CardTitle>
                        <CardDescription className="text-xl text-white">
                          {category.name}
                        </CardDescription>
                      </div>
                      <CardFooter className="p-0 w-full  ">
                        <ConfirmationWizard
                          btn={
                            <Button
                              className="w-full rounded-t-none bg-secondary text-muted-foreground hover:bg-red-500/20"
                              disabled={deleteCategory.isPending}
                            >
                              <Trash2 />
                              Remove
                            </Button>
                          }
                          deleteFn={() =>
                            deleteCategoryHandler(category.type, category.name)
                          }
                        />
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </SkeletonWrapper>
  );
}
