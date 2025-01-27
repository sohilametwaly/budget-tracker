"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "./UI/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./UI/command";
import { Popover, PopoverContent, PopoverTrigger } from "./UI/popover";
import CreateCategory from "./CreateCategoryDiaglog";

export function CategoriesPicker({ type, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categories, setCategories] = useState();
  const fetchedCategories = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (!selectedCategory) return;
    onChange(selectedCategory);
  }, [selectedCategory, onChange]);

  useEffect(() => {
    if (!fetchedCategories.data) return;
    setCategories(fetchedCategories.data.categories);
  }, [fetchedCategories]);

  function successCallBack(category) {
    setSelectedCategory(category);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <span role="img">{selectedCategory.icon}</span>
              <span>{selectedCategory.name}</span>
            </div>
          ) : (
            "Select category..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CreateCategory type={type} successCallBack={successCallBack} />
          <CommandEmpty className="flex flex-col p-3 items-center">
            Category not found.
            <span className="text-muted-foreground text-xs">
              Tip: Create a new category
            </span>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categories?.map((category) => (
                <CommandItem
                  key={category.name}
                  value={category.name}
                  onSelect={(currentValue) => {
                    setSelectedCategory(
                      currentValue === selectedCategory?.name ? null : category
                    );

                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span role="img">{category.icon}</span>
                    <span>{category.name}</span>
                    {category == selectedCategory && <CheckIcon />}
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
