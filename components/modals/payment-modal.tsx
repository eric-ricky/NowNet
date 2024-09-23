"use client";

import { api } from "@/convex/_generated/api";
import useActiveUser from "@/hooks/db/use-active-user";
import { usePaymentModal } from "@/hooks/modal-state/use-payment-modal";
import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const PaymentModal = () => {
  const { activeUser } = useActiveUser();
  const { isOpen, onClose, setPaymentPayload, paymentPayload } =
    usePaymentModal();

  const createTopupTransaction = useMutation(
    api.topuptransactions.createTopupTransaction
  );

  const [amount, setAmount] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState(paymentPayload?.redirect_url);
  const [loading, setLoading] = useState(false);

  const handleProcessPayment = async () => {
    if (!activeUser) return;

    if (!amount)
      return toast.error("Please enter a valid amount", {
        style: {
          color: "red",
        },
      });

    const toastId = toast.loading("Processing Payment", {
      id: "loadingProcessingPayment",
      style: { color: "black" },
    });

    try {
      setLoading(true);
      // get payment Id
      const paymentId = await createTopupTransaction({
        amount: `${amount}`,
        confirmation_code: "",
        created_date: "",
        currency: "",
        description: "",
        order_tracking_id: "",
        payment_account: "",
        payment_method: "",
        payment_status_description: "Pending",
        user: activeUser._id,
      });
      const data = await axios.post(`/api/payment/v2`, {
        email: activeUser.email,
        name: activeUser.name,
        phone: activeUser.phone,
        amount,
        paymentId,
        description: "Payment description",
      });

      if (data.data.data.error) throw new Error("Something went wrong");

      const { merchant_reference, order_tracking_id, redirect_url } =
        data.data.data;
      setRedirectUrl(redirect_url);
      setPaymentPayload({
        merchant_reference,
        order_tracking_id,
        redirect_url,
      });
      toast.dismiss(toastId);
    } catch (error) {
      console.log("Error ====>", error);
      toast.error("Error processing payment", {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-1/90" />

      <DialogContent className="max-w-fit md:min-w-[700px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>Topup Account</DialogTitle>
          <Description className="hidden">payment modal</Description>
        </DialogHeader>

        {redirectUrl && (
          <iframe
            src={redirectUrl}
            className="w-full h-full min-h-[75vh]"
          ></iframe>
        )}

        {!redirectUrl && (
          <div className="flex flex-col gap-10 p-10 w-full h-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Enter Amount (KES)</Label>
              <Input
                placeholder="Amount(KES)"
                min={1}
                max={10000}
                step={1}
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
              />
            </div>

            <Button disabled={loading} onClick={handleProcessPayment}>
              {loading && <Loader size={20} className="mr-2 animate-spin" />}
              Continue {!loading && <ArrowRight size={20} className="ml-2" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

const PaymentModalOld = () => {
  const [step, setStep] = useState(0);
  const { isOpen, onClose, setPaymentPayload, paymentPayload } =
    usePaymentModal();

  const { activeUser } = useActiveUser();

  const createPayment = useMutation(api.payments.createPayments);

  const router = useRouter();
  const [amount, setAmount] = useState("10");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (paymentPayload) setPaymentPayload(undefined);
    setAmount(e.target.value);
  };

  useEffect(() => {
    if (!paymentPayload) return;

    const onCreatePayment = async () => {
      if (!activeUser) return;

      const toastId = toast.loading("Creating payment", {
        id: "payment-modal-toast",
      });

      try {
        // await createPayment({
        //   amount: +paymentPayload.amount,
        //   reason: "buy_token",
        //   date: `${new Date()}`,
        //   user: activeUser._id,
        //   transanctionReference: paymentPayload.transanctionReference,
        //   note: `Paypal payment for ${paymentPayload.amount}. Transaction reference: ${paymentPayload.transanctionReference}`,
        // });

        toast.success(`Transaction completed successfully`, {
          id: toastId,
          style: { color: "black" },
        });

        setStep(0);
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

    onCreatePayment();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentPayload, createPayment]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-1/90" />

      <DialogContent className="max-w-fit md:min-w-[500px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>Make Payment</DialogTitle>
          <Description className="hidden">payment modal</Description>
        </DialogHeader>

        <div className="space-y-4 py-4 px-8 max-h-[70vh] overflow-y-auto">
          {step === 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Enter Amount (USD) {amount}</Label>
              <Input
                placeholder="Amount(USD)"
                min={1}
                step={0.01}
                value={amount}
                onChange={handleAmountChange}
              />

              <Button onClick={() => setStep(1)}>Continue</Button>
            </div>
          )}

          {/* {step === 1 && (
            <PayPalScriptProvider
              options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  console.log("CREATEORDER ===>", data);
                  setPaymentPayload(undefined);
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                          currency_code: "USD",
                        },
                      },
                    ],
                    intent: "CAPTURE",
                  });
                }}
                onApprove={(data, actions) => {
                  console.log("APPROVE ORDER ===>", data);

                  return actions.order!.capture().then((details) => {
                    console.log("DETAILS", details);

                    const paymentId = details.id;
                    const amountPayed =
                      details?.purchase_units?.[0]?.amount?.value;

                    // setPaymentPayload({
                    //   amount: amountPayed!,
                    //   reason: "buy_token",
                    //   note: "Payment for token",
                    //   transanctionReference: paymentId!,
                    // });
                    // onClose();
                    // router.refresh();
                  });
                }}
              />
            </PayPalScriptProvider>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
