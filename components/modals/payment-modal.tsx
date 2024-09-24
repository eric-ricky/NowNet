"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useActiveUser from "@/hooks/db/use-active-user";
import { usePaymentModal } from "@/hooks/modal-state/use-payment-modal";
import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import { useMutation } from "convex/react";
import { ArrowRight, Loader, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
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
  const { isOpen, onClose } = usePaymentModal();

  const createTopupTransaction = useMutation(
    api.topuptransactions.createTopupTransaction
  );
  const deleteTransaction = useMutation(
    api.topuptransactions.deleteTopupTransaction
  );

  const [amount, setAmount] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentRef, setPaymentRef] = useState<Id<"topuptransactions">>();

  const handleCloseModal = async () => {
    const toastId = toast.loading("Cancelling payment", {
      id: "loadingCancellingPayment",
      style: { color: "black" },
      action: (
        <X
          size={20}
          onClick={() => toast.dismiss("loadingCancellingPayment")}
          className="ml-auto cursor-pointer"
        />
      ),
    });

    try {
      setLoading(true);

      if (paymentRef) {
        setRedirectUrl("");
        setPaymentRef(undefined);
        await deleteTransaction({
          id: paymentRef,
        });
      }

      setRedirectUrl("");
      setPaymentRef(undefined);
      toast.dismiss(toastId);

      console.log("CLOSING");
      onClose();
    } catch (error) {
      console.log(error);
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
      setPaymentRef(paymentId);
      const data = await axios.post(`/api/payment/v2`, {
        email: activeUser.email,
        name: activeUser.name,
        phone: activeUser.phone,
        amount,
        paymentId,
        description: "NowNet Services Account Topup",
      });

      if (data.data.data.error) throw new Error("Something went wrong");

      const { merchant_reference, redirect_url } = data.data.data;
      setRedirectUrl(redirect_url);

      // setPaymentPayload({
      //   merchant_reference,
      //   order_tracking_id,
      //   redirect_url,
      // });
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
    <Dialog open={isOpen} onOpenChange={handleCloseModal} modal>
      <DialogOverlay
        onClick={() => console.log("first")}
        className="bg-black-1/90"
      />

      <DialogContent className="max-w-fit md:min-w-[700px] min-w-[90vw] p-0 rounded-md">
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>Topup Account</DialogTitle>
          <Description className="hidden">Topup modal</Description>
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

        <CardFooter className="border-t pt-2 flex items-center justify-center text-sm italic">
          <span>Powered by</span>
          <Image src="/images/pesapal.png" alt="." width={100} height={100} />
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
