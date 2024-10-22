"use client";

import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useNetworkModal } from "@/hooks/modal-state/use-network-modal";
import { getNextPaymentDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
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

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  speed: z.string().min(1, "Speed is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
});

const NetworkModal = () => {
  const { isOpen, onClose, network } = useNetworkModal();
  const { activeUser } = useActiveUser();
  const createWifiNetwork = useMutation(api.wifis.createWifi);
  const createEarning = useMutation(api.earnings.createEarning);
  const updateWifiNetwork = useMutation(api.wifis.updateWifi);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: network?.name || "",
      rate: network?.rate || 0,
      speed: network?.speed || "",
    },
  });

  const loadingMessage = network ? "Editing network..." : "Adding network...";
  const successMessage = network ? "edited successfuly" : "added successfully";

  useEffect(() => {
    form.reset();

    if (network?._id) {
      form.setValue("name", network.name);
      form.setValue("rate", network.rate);
      form.setValue("speed", network.speed!);

      return;
    }
  }, [form, network]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!activeUser?._id) return;

    const toastId = toast.loading(loadingMessage, {
      id: "loadingAddNetwork",
      style: { color: "black" },
    });

    try {
      const { name, speed, rate } = formData;
      if (!network) {
        const owner = activeUser._id;
        const newWifiId = await createWifiNetwork({
          name,
          owner,
          rate,
          speed,
        });

        // initiate earning
        const now = new Date();
        const weekEnding = `${getNextPaymentDate(now)}`; // the next  monday from now
        await createEarning({
          wifi: newWifiId,
          owner,
          totalEarnings: 0,
          commission: 0,
          ownerEarnings: 0,
          isArchived: false,
          isUpcoming: true,
          weekEnding,
        });
      }

      if (network) {
        await updateWifiNetwork({
          id: network._id,
          owner: activeUser._id,
          name,
          rate,
          speed,
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
          : `Error ${network ? "editing" : "adding"} network`;
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
          <DialogTitle>{network ? "Edit" : "New"} Network</DialogTitle>
          <DialogDescription className="hidden">
            Add and edit your wifi networks
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
                      <FormLabel className="md:w-40">Network Name*</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input placeholder="Network name" {...field} />
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">Rate Per Month</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Rate (per month)"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name="speed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">Speed (Mbps)</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Speed in Mbps"
                            {...field}
                          />
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
                  {network ? "Edit" : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkModal;
