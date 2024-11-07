"use client";

import { sendNotification } from "@/actions/push-notifications";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useSubscriptionModal } from "@/hooks/modal-state/use-subscription-modal";
import { NOTIFICATION_CHARGE } from "@/lib/constants";
import { INetworksData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import NetworkSearch from "./network-search";

const FormSchema = z.object({
  device: z.string().min(1, "Device is Required"),
});

const SubscriptionModal = () => {
  const { isOpen, onClose } = useSubscriptionModal();
  const updateUser = useMutation(api.users.updateUser);
  const createSubscription = useMutation(api.subscriptions.createSubscription);

  // networks
  const [selectedNetwork, setSelectedNetwork] = useState<INetworksData>();

  // devices
  const [open, setOpen] = useState(false); // devices options popover
  const { activeUser } = useActiveUser();
  const userDevices = useQuery(api.devices.getUsersDevices, {
    user: activeUser?._id,
  });
  const devicesOptions = useMemo(() => {
    if (!userDevices) return [];

    return userDevices?.map((device) => ({
      value: device._id,
      label: device.name,
      macAddress: device.macAddress,
    }));
  }, [userDevices]);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      device: "",
    },
  });

  useEffect(() => {
    form.reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!selectedNetwork)
      return toast.error("Please select a wifi network", {
        style: { color: "red" },
      });

    if (!activeUser || !userDevices) return;

    const toastId = toast.loading("Creating subscription...", {
      id: "loadingCreateSubscription",
      style: { color: "black" },
    });

    try {
      const { device: deviceLabel } = formData;

      const selectedDevice = userDevices.find(
        (device) => device.name === deviceLabel
      );

      if (!selectedDevice)
        return toast.error("No device has been selected", {
          id: toastId,
          style: { color: "red" },
        });

      const now = `${new Date()}`;

      // create subscription and charge x amount from user (for notifications)
      await createSubscription({
        user: activeUser._id,
        wifi: selectedNetwork._id,
        device: selectedDevice._id,
        isActive: true,
        startTime: now,
        lastCredited: now,
        endTime: undefined,
        amountConsumed: 0,
        status: "pending",

        notification_charge: NOTIFICATION_CHARGE,
      });

      // ==== 🔔 NOTIFY OWNER (Push Notification)
      const owner = selectedNetwork.owner;
      if (owner?.notificationSubscription) {
        console.log(
          "SENDING PUSH NOTIFICATION ====>",
          owner.notificationSubscription
        );
        await sendNotification({
          title: "New Connection request",
          message: `${activeUser.name} is requesting to connect to ${selectedNetwork.name}`,
          user: JSON.stringify(owner),
        });
      }

      // Email Notifications to owner
      await axios.post(`/api/knock/new-connection-notification`, {
        recipient_userId: selectedNetwork.owner?._id,
        recipient_email: selectedNetwork.owner?.email,
        recipient_username: selectedNetwork.owner?.name,
        username: activeUser.name,
        macaddress: selectedDevice.macAddress,
        wifiname: selectedNetwork.name,
        primary_action_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/networks/${selectedNetwork._id}`,
      });

      // success
      toast.success(`Subscription created successfully`, {
        id: toastId,
        style: { color: "black" },
      });

      onClose();
      router.refresh();
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError
          ? error.data
          : "Error creating subscription";
      toast.error(errorMsg, {
        id: toastId,
        style: {
          color: "red",
        },
      });
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-1/90" />

      <DialogContent className="max-w-fit md:min-w-[800px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>Connect to a Wi-fi network</DialogTitle>
          <DialogDescription className="hidden">
            Search and connect your devices to a network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 ">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* Wifi network */}
              <NetworkSearch
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />

              {/* device */}
              <div className="p-4 md:px-8 pb-8 space-y-4">
                {userDevices ? (
                  <FormField
                    control={form.control}
                    name="device"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Image
                              src={"/images/img_holder.png"}
                              alt=""
                              width={40}
                              height={40}
                              className=""
                            />

                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between"
                                >
                                  {devicesOptions.find(
                                    (d) => d.label === field.value
                                  )?.label || "Find Device"}

                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-fit md:min-w-[700px] w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search device..." />
                                  <CommandList>
                                    <CommandEmpty>No item found.</CommandEmpty>
                                    <CommandGroup>
                                      {userDevices.map((device) => (
                                        <CommandItem
                                          key={device._id}
                                          value={device.name}
                                          onSelect={(currentValue) => {
                                            field.value !== currentValue &&
                                              form.setValue(
                                                "device",
                                                currentValue
                                              );

                                            setOpen(false);
                                          }}
                                        >
                                          <div className="flex items-center">
                                            <Image
                                              src={"/images/img_holder.png"}
                                              alt=""
                                              width={20}
                                              height={20}
                                              className={cn("mr-2", {
                                                " rounded-full p-1 border border-orange-400":
                                                  field.value === device.name,
                                              })}
                                            />
                                            {device.name}
                                          </div>

                                          <div className="ml-auto">
                                            <Check
                                              className={cn(
                                                "ml-auto mr-2 h-4 w-4",
                                                field.value === device.name
                                                  ? "opacity-100 flex"
                                                  : "opacity-0 hidden"
                                              )}
                                            />
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-full h-10 ml-4" />
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-b-md justify-end flex">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  size={"sm"}
                  className="ml-2"
                >
                  {isSubmitting && (
                    <Loader size={18} className="mr-1 animate-spin" />
                  )}
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
