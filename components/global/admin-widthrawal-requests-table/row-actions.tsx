"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ITransactions } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Banknote, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const widthrawalRequest = row.original as ITransactions;

  const updateRequest = useMutation(api.transactions.updateTransaction);
  const updateUser = useMutation(api.users.updateUser);

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [action, setAction] = useState<"cancel" | "pay">();
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

      const {
        _creationTime,
        _id,
        amount,
        phoneNumber,
        reference,
        status,
        timeStamp,
        type,
        user,
        transanctionCost,
      } = widthrawalRequest;

      // update request
      await updateRequest({
        id: widthrawalRequest._id,
        user: widthrawalRequest.user?._id! as Id<"users">,
        status: action === "pay" ? "COMPLETED" : "PENDING",
        amount,
        reference,
        timeStamp,
        transanctionCost,
        type,
      });

      // update user balance
      if (action === "cancel") {
        const amount = widthrawalRequest.amount;
        const transactionsCost = widthrawalRequest.transanctionCost || 0;
        await updateUser({
          id: widthrawalRequest.user?._id! as Id<"users">,
          balance:
            widthrawalRequest.user?.balance! + (amount + transactionsCost),
        });
      }

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
          {widthrawalRequest.status === "PENDING" && (
            <DropdownMenuItem
              onClick={() => {
                setAction("pay");
                setOpenAlertModal(true);
              }}
              className="flex items-center space-x-1 text-sm"
            >
              <Banknote className="size-5 mr-1 text-muted-foreground" />
              Pay User
            </DropdownMenuItem>
          )}

          {/* {widthrawalRequest.status === "COMPLETED" && (
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
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
