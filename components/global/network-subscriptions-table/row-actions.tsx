"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { ISubscriptionsData } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Copy, Link2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const updateSubscription = useMutation(api.subscriptions.updateSubscription);

  const subscription = row.original as ISubscriptionsData;

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyMacAddress = () => {
    const macAddress = subscription.device?.macAddress!;
    navigator.clipboard.writeText(macAddress);
    toast.success("Mac Address copied successfully!");
  };

  const onConnect = async () => {
    if (!subscription) return;

    const toastId = toast.loading("Making as connected", {
      id: "loadingMarkingAsConnected",
      style: { color: "black" },
    });

    try {
      setLoading(true);

      await updateSubscription({
        id: subscription._id,
        status: "connected",
        startTime: `${new Date()}`,
      });

      // TODO:
      // Email Notifications (to user and super admin)
      await axios.post(`/api/mail`, {
        email: [subscription.user?.email!, "info.gasiapp@gmail.com"],
        subject: `Network ${subscription.wifi?.name} has been connected`,
        message: `
        <p>Wifi: ${subscription.wifi?.name}</p>
        <p>Device Name: ${subscription.device?.name}</p>
        <p>Device Mac Address: ${subscription.device?.macAddress}</p>
        <br />
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/app/subscriptions">Check Subscriptions</a>
        `,
      });

      // success
      toast.success(`Connected successfully`, {
        id: toastId,
        style: { color: "black" },
      });
      setOpenAlertModal(false);
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError
          ? error.data
          : "Error marking as connected";
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
        onConfirm={onConnect}
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

        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem className="flex text-sm" onClick={onCopyMacAddress}>
            Copy Mac Address
            <DropdownMenuShortcut>
              <Copy size={14} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {subscription.status === "pending" && (
            <DropdownMenuItem
              className="flex text-sm"
              onClick={() => {
                setOpenAlertModal(true);
              }}
            >
              Mark as Connected
              <DropdownMenuShortcut>
                <Link2 size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
