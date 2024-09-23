"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useDeviceModal } from "@/hooks/modal-state/use-device-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import useActiveUser from "@/hooks/db/use-active-user";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const FormSchema = z.object({
  macAddress: z.string().min(1, "Mac Address is required"),
  name: z.string().min(1, "Name is required"),
});

const DeviceModal = () => {
  const { isOpen, onClose, device } = useDeviceModal();
  const { activeUser } = useActiveUser();
  const createDevice = useMutation(api.devices.createDevice);
  const updateDevice = useMutation(api.devices.updateDevice);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: device?.name || "",
      macAddress: device?.macAddress || "",
    },
  });

  const loadingMessage = device ? "Editing device..." : "Adding device...";
  const successMessage = device ? "edited successfuly" : "added successfully";

  useEffect(() => {
    form.reset();

    if (device?._id) {
      form.setValue("name", device.name);
      form.setValue("macAddress", device.macAddress);

      return;
    }
  }, [isOpen, form, device]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!activeUser?._id) return;

    const toastId = toast.loading(loadingMessage, {
      id: "loadingAddDevice",
      style: { color: "black" },
    });

    try {
      const { name, macAddress } = formData;
      if (!device) {
        const newDeviceId = await createDevice({
          name,
          macAddress,
          user: activeUser._id,
        });
      }

      if (device) {
        await updateDevice({
          id: device._id,
          name,
          macAddress,
          user: activeUser._id,
        });
      }

      form.reset();
      toast.success(`${name} ${successMessage}`, {
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
          : `Error ${device ? "editing" : "adding"} device`;
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

      <DialogContent className="max-w-fit md:min-w-[500px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>{device ? "Edit" : "New"} Device</DialogTitle>
          <DialogDescription className="hidden">
            Add devices you can use to connect to various networks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 ">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="p-4 md:px-8 pb-8 space-y-4">
                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">Device Name*</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input placeholder="Device name" {...field} />
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name="macAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">Mac Address*</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input placeholder="Mac address" {...field} />
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
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
                  {device ? "Edit" : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceModal;
