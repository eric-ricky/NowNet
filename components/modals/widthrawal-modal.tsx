"use client";

import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { useWidthrawalModal } from "@/hooks/modal-state/use-widthrawal-modal";
import { WIDTHRAWAL_TRANSACTION_COST } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader } from "lucide-react";
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
  amount: z.string().min(1, "Amount is required"),
  phone: z.string().min(1, "Please provide a valid phone number"),
});

const WidthrawalModal = () => {
  const { isOpen, onClose } = useWidthrawalModal();
  const { activeUser } = useActiveUser();
  const createWidthrawalRequest = useMutation(
    api.widthrawaltransactions.createWidthrawalTransaction
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: "500",
    },
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!activeUser?._id) return;

    const toastId = toast.loading("Requesting widthrawal", {
      id: "loadingRequestingWidhtrawal",
      style: { color: "black" },
    });

    try {
      const { amount, phone } = formData;
      const transaction_cost = WIDTHRAWAL_TRANSACTION_COST;
      const total_amount = +amount + transaction_cost;
      const total_payable = +amount;
      await createWidthrawalRequest({
        total_amount,
        total_payable,
        transaction_cost,
        currency: "KES",
        description: "",
        payment_account: phone,
        payment_method: "MpesaKE",
        payment_status_description: "Pending",
        user: activeUser._id,
      });

      form.reset();
      toast.success(`Widthrawal request sent successfully`, {
        id: toastId,
        style: { color: "black" },
      });
      onClose();
      // router.refresh();
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError ? error.data : `Something went wrong`;
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
          <DialogTitle> Widthraw from your account</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Please note that the minimum amount per transaction is 500 KES.{" "}
            <br />
            Transaction cost KES {WIDTHRAWAL_TRANSACTION_COST}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 ">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="p-4 md:px-8 pb-8 space-y-4">
                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">
                        Enter Amount (KES)
                      </FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            min={500}
                            max={10000}
                            placeholder="Amount"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="md:w-40">
                        Enter Phone Number
                      </FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <Input placeholder="+254 7" {...field} />
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
                  Continue to Widthraw
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidthrawalModal;
