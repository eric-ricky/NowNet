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
import useActiveUser from "@/hooks/db/use-active-user";
import { IEarningsData } from "@/lib/types";
import { getNextPaymentDate } from "@/lib/utils";
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
  const { activeUser } = useActiveUser();

  const earning = row.original as IEarningsData;
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const payEarning = useMutation(api.earnings.payEarning);

  const onSendMoney = async () => {
    if (!earning.owner || !activeUser) return;

    const toastId = toast.loading(`Sending money to ${earning.owner.name}`, {
      id: "loadingSendingMoney",
      style: {
        color: "black",
      },
    });
    try {
      setLoading(true);
      const now = new Date();
      const nextWeekEnding = `${getNextPaymentDate(now)}`; // the next  monday from now
      await payEarning({
        earningId: earning._id,
        nextWeekEnding,
        adminEmail: activeUser.email,
      });
      toast.success("Payment made successfully!", {
        id: toastId,
        style: {
          color: "black",
        },
      });
      setOpenAlertModal(false);
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
        onConfirm={onSendMoney}
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
          <DropdownMenuItem
            disabled={!earning.isUpcoming || !activeUser}
            onClick={() => setOpenAlertModal(true)}
            className="flex items-center space-x-1 text-sm"
          >
            <Banknote size={14} className="mr-2 text-muted-foreground" />
            Send money
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
