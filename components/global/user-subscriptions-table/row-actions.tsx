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
import { ISubscriptionsData } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Copy, Link2Off, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const subscription = row.original as ISubscriptionsData;
  const owner = useQuery(api.users.getUserById, {
    userId: subscription.wifi?.owner,
  });
  const updateSubscription = useMutation(api.subscriptions.updateSubscription);
  const createSubscription = useMutation(api.subscriptions.createSubscription);

  // wifi owner
  const wifiOwner = useQuery(api.users.getUserById, {
    userId: subscription.wifi?.owner,
  });

  const [action, setAction] = useState<"delete" | "disconnect" | "reconnect">();

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyMacAddress = () => {
    const macAddress = subscription.device?.macAddress!;
    navigator.clipboard.writeText(macAddress);
    toast.success("Mac Address copied successfully!");
  };

  // status to disconnected
  const onDisconnect = async () => {
    if (!subscription) return;

    const toastId = toast.loading("Disconnecting from network", {
      id: "loadingDisconnecting",
      style: { color: "black" },
    });

    try {
      setLoading(true);

      await updateSubscription({
        id: subscription._id,
        status: "disconnected",
        endTime: `${new Date()}`,
      });

      // TODO:
      // Email Notifications (to wifi owner and super admin)
      await axios.post(`/api/mail`, {
        email: [owner?.email, "info.gasiapp@gmail.com"],
        subject: `Disconnect ${subscription.user?.name}'s ${subscription.device?.name} from ${subscription.wifi?.name}`,
        message: `
        <p>Wifi: ${subscription.wifi?.name}</p>
        <p>Device Name: ${subscription.device?.name}</p>
        <p>Device Mac Address: ${subscription.device?.macAddress}</p>
        <br />
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/app/networks/${subscription.wifi?._id}">Check Subscription</a>
        `,
      });

      // success
      toast.success(`Disconnected successfully`, {
        id: toastId,
        style: { color: "black" },
      });
      setOpenAlertModal(false);
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError
          ? error.data
          : "Error disconnecting from network";
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

  // reconnecting
  const onReconnect = async () => {
    if (!subscription) return;

    const { user, wifi, device } = subscription;
    if (!user?._id || !wifi?._id || !device?._id || !wifiOwner?._id) return;

    // current status has to be 'disconnected'
    if (subscription.status !== "disconnected") return;

    const toastId = toast.loading("Reconnecting to network", {
      id: "loadingReconnecting",
      style: { color: "black" },
    });

    try {
      setLoading(true);

      // create a new subscription
      const now = `${new Date()}`;
      const newWifiId = await createSubscription({
        user: user._id,
        wifi: wifi._id,
        device: device._id,
        isActive: true,
        startTime: now,
        lastCredited: now,
        endTime: undefined,
        amountConsumed: 0,
        status: "pending",
      });

      // update current one to isActive false
      await updateSubscription({
        id: subscription._id,
        isActive: false,
      });

      // TODO:
      // Email Notifications
      // await axios.post(`/api/mail`, {
      //   email: [wifiOwner.email, "info.gasiapp@gmail.com"],
      //   subject: `${user.name} is requesting to reconnect to your wifi Network`,
      //   message: `
      //   <p>Wifi: ${wifi.name}</p>
      //   <p>Device Name: ${device.name}</p>
      //   <p>Device Mac Address: ${device.macAddress}</p>
      //   <br />
      //   <br />
      //   <a href="${process.env.NEXT_PUBLIC_SITE_URL}networks/${newWifiId}">Check Request</a>
      //   `,
      // });

      // Email Notifications to wifi owners

      // success
      toast.success(`Subscription created successfully`, {
        id: toastId,
        style: { color: "black" },
      });
    } catch (error: any) {
      console.log("ERROR RECONNECTING", error);
      const errorMsg =
        error instanceof ConvexError
          ? error.data
          : "Error reconnecting to network";
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

  // ==== change isActive to false
  const onDelete = async () => {
    if (!subscription) return;

    // Delete only pending and disconnected subs
    if (subscription.status === "connected") return;

    const toastId = toast.loading("Deleting subscription", {
      id: "loadingDeleting",
      style: { color: "black" },
    });

    try {
      setLoading(true);

      await updateSubscription({
        id: subscription._id,
        isActive: false,
      });

      // success
      toast.success(`Deleted successfully`, {
        id: toastId,
        style: { color: "black" },
      });
      setOpenAlertModal(false);
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError
          ? error.data
          : "Error deleting subscription";
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
        onConfirm={() => {
          if (action === "delete") return onDelete();
          if (action === "disconnect") return onDisconnect();
          if (action === "reconnect") return onReconnect();
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={!subscription.isActive}>
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
            Copy Mac Address
            <DropdownMenuShortcut>
              <Copy size={14} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {subscription.status === "connected" && (
            <DropdownMenuItem
              className="flex text-sm"
              onClick={() => {
                setAction("disconnect");
                setOpenAlertModal(true);
              }}
            >
              Disconnect
              <DropdownMenuShortcut>
                <Link2Off size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {subscription.status === "disconnected" && (
            <DropdownMenuItem
              className="flex text-sm"
              onClick={() => {
                setAction("reconnect");
                setOpenAlertModal(true);
              }}
            >
              Re Connect
              <DropdownMenuShortcut>
                <Link2Off size={14} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {subscription.status !== "connected" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={loading}
                onClick={() => {
                  setAction("delete");
                  setOpenAlertModal(true);
                }}
                className="text-red-500"
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash size={14} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
