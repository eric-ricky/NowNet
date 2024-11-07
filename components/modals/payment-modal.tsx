"use client";

import { checkTransactionStatus, initiateMpesaPayment } from "@/actions/mpesa";
import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { usePaymentModal } from "@/hooks/modal-state/use-payment-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
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

const PaymentModal = () => {
  const { activeUser } = useActiveUser();
  const { isOpen, onClose } = usePaymentModal();

  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState("");

  const createTransaction = useMutation(api.transactions.createTransaction);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (!checkoutRequestId) return;

    const timer = setInterval(() => {
      console.log("RUNNING CHECKPAYMENTSTATUS ====-------------");
      checkPaymentStatus(checkoutRequestId);
    }, 5000);

    if (!checkoutRequestId) clearInterval(timer);

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutRequestId]);

  const checkPaymentStatus = async (checkoutRequestId: string) => {
    setCheckingStatus(true);
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 5000; // 5 seconds

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        setCheckingStatus(false);
        toast.error(
          "Payment verification timeout. If you completed the payment, it will be reflected shortly."
        );
        return;
      }

      const status = await checkTransactionStatus(checkoutRequestId);

      console.log(attempts, "STATUS ====>", status);

      if (status.requestSuccess) {
        if (status.success) {
          setCheckoutRequestId("");
          toast.success("Payment completed successfully!");
          form.reset();
          setCheckingStatus(false);
          onClose();
        } else if (status.message.includes("pending")) {
          attempts++;
          setTimeout(checkStatus, interval);
        } else {
          setCheckoutRequestId("");
          toast.error(status.message || "Payment failed", {
            className: "text-red-500",
          });
          form.reset();
          setCheckingStatus(false);
        }
      }
    };

    await checkStatus();
  };

  const handleCloseModal = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!activeUser) return;
    setLoading(true);

    try {
      const response = await initiateMpesaPayment(
        values.phoneNumber,
        Number(values.amount)
      );

      if (response.success) {
        toast.success("STK push sent! Please check your phone.");
        console.log("RESPONSE ====>", response);

        // create a temporary transaction_record with reference
        // then in the callbackurl update it with the status from the response
        await createTransaction({
          user: activeUser._id,
          amount: Number(values.amount),
          phoneNumber: values.phoneNumber,
          reference: response.reference,
          status: "PENDING",
          timeStamp: new Date().toISOString(),
          type: "DEPOSIT",
        });

        setCheckingStatus(true);
        setCheckoutRequestId(response.reference);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal} modal>
      <DialogOverlay
        onClick={() => console.log("first")}
        className="bg-black-1/90"
      />

      <DialogContent className="max-w-fit md:min-w-[550px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-8 border-b">
          <DialogTitle>Topup Account</DialogTitle>
          <Description className="hidden">Topup modal</Description>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 p-4">
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
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="border-t pt-4 flex items-center justify-end gap-4 text-sm italic">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading || checkingStatus}>
                {loading ||
                  (checkingStatus && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ))}

                {loading
                  ? "Initiating Payment..."
                  : checkingStatus
                    ? "Verifying Payment..."
                    : "Continue"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
