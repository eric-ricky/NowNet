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
import { useNetworkModal } from "@/hooks/modal-state/use-network-modal";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Edit, MoreHorizontal, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const network = row.original as Doc<"wifis">;
  const { onOpen, setNetwork } = useNetworkModal();
  const deleteNetwork = useMutation(api.wifis.deleteWifi);

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!network) return;
    const toastId = toast.loading(`Deleting ${network.name}`, {
      id: "loadingDeletingNetwork",
      style: {
        color: "black",
      },
    });
    try {
      setLoading(true);
      await deleteNetwork({
        id: network._id,
      });
      toast.success("Network deleted successfully", {
        id: toastId,
        style: {
          color: "black",
        },
      });
    } catch (error: any) {
      console.log("ERROR HERE", error.data);
      const errorMsg =
        error instanceof ConvexError ? error.data : `Error deleting network`;
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

  const onUpdate = () => {
    if (!network) return;
    setNetwork(network);
    onOpen();
  };

  return (
    <>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        loading={loading}
        onConfirm={onDelete}
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
          <Link href={`/app/networks/${network._id}`}>
            <DropdownMenuItem className="flex items-center space-x-1 text-sm">
              <Settings size={14} className="mr-1 text-muted-foreground" />
              Manage Network
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center space-x-1 text-sm"
            onClick={onUpdate}
          >
            <Edit size={14} className="mr-1 text-muted-foreground" />
            Edit Network
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={loading}
            onClick={() => {
              setOpenAlertModal(true);
            }}
            className="text-red-500"
          >
            Delete
            <DropdownMenuShortcut>
              <Trash size={14} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
