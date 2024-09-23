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
import { useDeviceModal } from "@/hooks/modal-state/use-device-modal";
import { Row } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const device = row.original as Doc<"devices">;
  const deleteDevice = useMutation(api.devices.deleteDevice);

  const { setDevice, onOpen } = useDeviceModal();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyMacAddress = () => {
    const macAddress = device.macAddress;
    navigator.clipboard.writeText(macAddress);
    toast.success("Mac Address copied successfully!");
  };

  const onDelete = async () => {
    if (!device) return;

    const toastId = toast.loading(`Deleting ${device.name}`, {
      id: "loadingDeletingDevice",
      style: {
        color: "black",
      },
    });

    try {
      setLoading(true);
      await deleteDevice({
        id: device._id,
      });

      toast.success("Device deleted successfully", {
        id: toastId,
        style: {
          color: "black",
        },
      });
    } catch (error: any) {
      console.log("ERROR HERE", error);
      const errorMsg =
        error instanceof ConvexError ? error.data : `Error deleting device`;
      toast.error(errorMsg, {
        id: "toastId",
        style: {
          color: "red",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = () => {
    if (!device) return;

    onOpen();
    setDevice(device);
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
          <DropdownMenuItem className="flex text-sm" onClick={onCopyMacAddress}>
            <Copy size={14} className="mr-1 text-muted-foreground" />
            Copy Mac Address
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center space-x-1 text-sm"
            onClick={onUpdate}
          >
            <Edit size={14} className="mr-1 text-muted-foreground" />
            Edit Device
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
