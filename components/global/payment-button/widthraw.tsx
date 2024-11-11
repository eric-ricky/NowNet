"use client";

import { Button } from "@/components/ui/button";
import { useWidthrawalModal } from "@/hooks/modal-state/use-widthrawal-modal";
import { Banknote } from "lucide-react";

const PaymentWidthrawButton = () => {
  const { onOpen } = useWidthrawalModal();

  return (
    <Button
      onClick={onOpen}
      size={"sm"}
      className="active:scale-90 transition duration-300"
    >
      <Banknote size={20} className="size-5 mr-2 text-blue-500" />
      Widthraw
    </Button>
    // <Button
    //   onClick={onOpen}
    //   variant={"outline"}
    //   className="w-full rounded-full"
    // >
    //   <CreditCard className="mr-2 h-4 w-4" />
    //   Request Withdrawal
    // </Button>
  );
};

export default PaymentWidthrawButton;
