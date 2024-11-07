"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useActiveUser from "@/hooks/db/use-active-user";
import { useWidthrawalModal } from "@/hooks/modal-state/use-widthrawal-modal";
import { WIDTHRAWAL_TRANSACTION_COST } from "@/lib/constants";
import { getMpesaTransactionCost } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must not exceed 12 digits")
    .regex(
      /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-36-9])|(?:5[0-7])|(?:6[0-7])|(?:8[0-2])|(?:3[0-9]))[0-9]{6})$/,
      "Invalid Safaricom number"
    ),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1,
      "Minimum amount is KES 1"
    )
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) <= 150000,
      "Maximum amount is KES 150,000"
    ),
});

const WidthrawalModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useWidthrawalModal();
  const { activeUser } = useActiveUser();

  const createTransaction = useMutation(api.transactions.createTransaction);
  const updateUser = useMutation(api.users.updateUser);
  const userTransanctions = useQuery(
    api.transactions.getUserTransactionHistory,
    {
      userId: activeUser?._id as Id<"users">,
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!activeUser?._id) return;

    const toastId = toast.loading("Requesting widthrawal", {
      id: "loadingRequestingWidhtrawal",
      style: { color: "black" },
    });

    try {
      console.log("VALUES ===>", formData);
      const { amount, phoneNumber } = formData;
      const transaction_cost = getMpesaTransactionCost(+amount);
      let total_amount = +amount + transaction_cost;

      console.log("TOTAL_AMOUNT 1 ===>", total_amount);
      // Check if there are any pending withdrawal requests and add their amounts to the total_amount
      if (userTransanctions?.length) {
        const pendingWidthrawalRequestTotal = userTransanctions
          .filter(
            (transaction) =>
              transaction.status === "PENDING" &&
              transaction.type === "WITHDRAWAL"
          )
          .reduce(
            (acc, transaction) =>
              acc + transaction.amount + (transaction.transanctionCost || 0),
            0
          );
        total_amount += pendingWidthrawalRequestTotal;
      }

      console.log("TOTAL_AMOUNT 2 ===>", total_amount);

      // check if there are active subscriptions that will be affected by the widthrawal request

      // OR

      // User should disconnect all subscriptions before widthrawing

      // Check user balance before creating transaction
      if (activeUser.balance < total_amount) {
        toast.error("Insufficient balance", {
          id: toastId,
        });
        return;
      }

      // Create transaction (also updates user's balance)
      await createTransaction({
        user: activeUser._id,
        amount: +amount,
        transanctionCost: transaction_cost,
        phoneNumber: phoneNumber,
        reference: "TEMPORARY_REFERENCE",
        status: "PENDING",
        timeStamp: new Date().toISOString(),
        type: "WITHDRAWAL",
      });

      form.reset();
      toast.success(`Widthrawal request sent successfully`, {
        id: toastId,
        style: { color: "black" },
      });
      onClose();
      router.refresh();
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="254712345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (KES)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={1}
                          placeholder="1000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
