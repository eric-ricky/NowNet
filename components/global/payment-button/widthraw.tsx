"use client";

import { Button } from "@/components/ui/button";
import { useWidthrawalModal } from "@/hooks/modal-state/use-widthrawal-modal";
import { CreditCard } from "lucide-react";

const PaymentWidthrawButton = () => {
  const { onOpen } = useWidthrawalModal();

  return (
    <Button
      onClick={onOpen}
      variant={"outline"}
      className="w-full rounded-full"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Request Withdrawal
    </Button>
  );
};

export default PaymentWidthrawButton;
