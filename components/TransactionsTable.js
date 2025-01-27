import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/UI/button";
import { useState, useMemo } from "react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { DataTableFacetedFilter } from "@/components/datatable/FactedFilter";
import DeleteTransactionWizard from "./DeleteTransactionWizard";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Download } from "lucide-react";
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  fieldSeparator: ",",
  decimalSeparator: ".",
});

const emptyData = [];

export const columns = [
  {
    accessorKey: "Category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 capitalize">
          {row.original.CategoryIcon}
          <div className="capitalize">{row.original.Category}</div>
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    accessorKey: "Description",
    cell: ({ row }) => {
      return <div>{row.original.description}</div>;
    },
  },
  {
    accessorKey: "Date",
    cell: ({ row }) => {
      return <div>{new Date(row.original.date).toLocaleDateString()}</div>;
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "capitalize rounded text-center p-2 font-bold",
            row.original.type == "income"
              ? "bg-emerald-400/10 text-emerald-500"
              : "bg-red-400/10 text-red-500"
          )}
        >
          {row.original.type}
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    accessorKey: "Amount",
    cell: ({ row }) => {
      return <div>{row.original.amount}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Cell({ row }) {
      return (
        <DeleteTransactionWizard
          id={row.original.id}
          category={row.original.Category}
        />
      );
    },
  },
];

function TransactionsTable({ to, from }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const transactions = useQuery({
    queryKey: ["transactions", "history", to, from],
    queryFn: () =>
      fetch(`/api/transactions-history?to=${to}&from=${from}`).then((res) =>
        res.json()
      ),
  });

  const table = useReactTable({
    data: transactions.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categories = new Map();
    transactions.data?.forEach((transaction) => {
      categories.set(transaction.Category, {
        label: `${transaction.CategoryIcon} ${transaction.Category}`,
        value: transaction.Category,
      });
    });

    const uniqueCategories = new Set(categories.values());
    return Array.from(uniqueCategories);
  }, [transactions.data]);

  function handleExportCSV(data) {
    const csv = generateCsv(csvConfig)(data);
    download(data)(csv);
  }

  return (
    <div className="flex flex-col gap-3 items-start w-[90%]  m-auto sm:w-[95%]">
      <div className="flex justify-between w-full">
        <div className="flex gap-3">
          {table.getColumn("Category") && (
            <DataTableFacetedFilter
              title={"Category"}
              column={table.getColumn("Category")}
              options={categoriesOptions}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title={"type"}
              column={table.getColumn("type")}
              options={[
                {
                  value: "income",
                  label: "Income",
                },
                {
                  value: "expense",
                  label: "Expense",
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 h-8">
          <Button
            variant="outline"
            className="h-full"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                category: row.original.Category,
                categoryIcon: row.original.CategoryIcon,
                description: row.original.description,
                date: row.original.date,
                type: row.original.type,
                amount: row.original.amount,
              }));
              handleExportCSV(data);
            }}
          >
            <Download />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} className="h-full" />
        </div>
      </div>
      <SkeletonWrapper isLoading={transactions.isFetching}>
        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No result found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SkeletonWrapper>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default TransactionsTable;
