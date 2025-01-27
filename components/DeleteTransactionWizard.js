import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./UI/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./UI/alert-dialog";
import { toast } from "sonner";

import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "./UI/button";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function DeleteTransactionWizard({ id, category }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const deleteTransaction = useMutation({
    mutationKey: "deleteTransaction",
    mutationFn: (id) => {
      fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success(`Transaction deleted successfully 🎉`, {
        id: "delete-transaction",
      });
      queryClient.refetchQueries({
        queries: [{ queryKey: ["transactions", "history"] }],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error("Failed to delete transaction", {
        id: "delete-transaction",
      });
    },
  });

  const deleteTransactionHandler = useCallback(() => {
    if (id && category) {
      deleteTransaction.mutate(id);
      toast.loading(`Deleting ${category}...`, {
        id: "delete-transaction",
      });
    }
  }, [deleteTransaction, category, id]);
  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        deleteFn={deleteTransactionHandler}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <Button variant="ghost" disabled={deleteTransaction.isPending}>
              <Trash /> Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default DeleteTransactionWizard;

function DeleteTransactionDialog({ open, setOpen, deleteFn }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This action cannot be undone. This will permanently delete your
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteFn}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
