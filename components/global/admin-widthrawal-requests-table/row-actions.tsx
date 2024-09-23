"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Banknote, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const widthrawalRequest = row.original as Doc<"widthrawaltransactions">;

  const updateRequest = useMutation(
    api.widthrawaltransactions.updateWidthrawalTransaction
  );

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [action, setAction] = useState<"cancel" | "pay" | "reverse">();
  const [loading, setLoading] = useState(false);

  const onUpdate = async () => {
    if (!widthrawalRequest || !action) return;
    const toastId = toast.loading(`Updating request`, {
      id: "loadingCancelRequest",
      style: {
        color: "black",
      },
    });

    try {
      setLoading(true);
      await updateRequest({
        id: widthrawalRequest._id,
        payment_status_description:
          action === "cancel"
            ? "Invalid"
            : action === "reverse"
              ? "Reversed"
              : "Completed",
      });
      toast.success("Request updated successfully", {
        id: toastId,
        style: {
          color: "black",
        },
      });
      setOpenAlertModal(false);
      setAction(undefined);
    } catch (error: any) {
      console.log("ERROR HERE", error.data);
      const errorMsg =
        error instanceof ConvexError ? error.data : `Something went wrong`;
      toast.error(errorMsg, {
        id: toastId,
        style: {
          color: "red",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        loading={loading}
        onConfirm={onUpdate}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[180px]">
          {widthrawalRequest.payment_status_description !== "Completed" && (
            <DropdownMenuItem
              onClick={() => {
                setAction("pay");
                setOpenAlertModal(true);
              }}
              className="flex items-center space-x-1 text-sm"
            >
              <Banknote size={14} className="mr-1 text-muted-foreground" />
              Mark as Paid
            </DropdownMenuItem>
          )}

          {widthrawalRequest.payment_status_description === "Completed" && (
            <DropdownMenuItem
              onClick={() => {
                setAction("reverse");
                setOpenAlertModal(true);
              }}
              className="flex items-center space-x-1 text-sm"
            >
              <Banknote size={14} className="mr-1 text-muted-foreground" />
              Reverse Payment
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {widthrawalRequest.payment_status_description === "Pending" && (
            <DropdownMenuItem
              disabled={loading}
              onClick={() => {
                setAction("cancel");
                setOpenAlertModal(true);
              }}
              className="text-red-500"
            >
              Cancel Request
              <DropdownMenuShortcut>
                <Trash size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
