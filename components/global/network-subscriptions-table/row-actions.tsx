"use client";

import { sendNotification } from "@/actions/push-notifications";
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
import useActiveUser from "@/hooks/db/use-active-user";
import { NOTIFICATION_CHARGE } from "@/lib/constants";
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

  const { activeUser } = useActiveUser();
  const updateUser = useMutation(api.users.updateUser);

  const subscription = row.original as ISubscriptionsData;

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyMacAddress = () => {
    const macAddress = subscription.device?.macAddress!;
    navigator.clipboard.writeText(macAddress);
    toast.success("Mac Address copied successfully!");
  };

  const onConnect = async () => {
    if (!activeUser) return;
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

      // charge x amount from user
      await updateUser({
        id: activeUser._id,
        balance: activeUser.balance - NOTIFICATION_CHARGE,
      });

      // ==== 🔔 NOTIFY USER (Push Notification)
      if (subscription.user?.notificationSubscription) {
        await sendNotification({
          title: `${subscription.device?.name} Connected 🎉`,
          message: `${subscription.device?.name} has been connected to ${subscription.wifi?.name}`,
          user: JSON.stringify(subscription.user),
        });
      }

      // Email Notifications to user
      await axios.post(`/api/knock/device-connected-notification`, {
        recipient_userId: subscription.user?._id,
        recipient_email: subscription.user?.email,
        recipient_username: subscription.user?.name,
        devicename: subscription.device?.name,
        macaddress: subscription.device?.macAddress,
        wifiname: subscription.wifi?.name,
        primary_action_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/subscriptions`,
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
