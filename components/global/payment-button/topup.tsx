"use client";

import { Button } from "@/components/ui/button";
import useActiveUser from "@/hooks/db/use-active-user";
import { usePaymentModal } from "@/hooks/modal-state/use-payment-modal";
import { CreditCard } from "lucide-react";

const PaymentTopupButton = () => {
  const { activeUser } = useActiveUser();
  const { onOpen: onOpenPaymentModal } = usePaymentModal();

  return (
    <Button
      disabled={!activeUser}
      onClick={onOpenPaymentModal}
      className="w-full rounded-full"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Top Up Now
    </Button>
  );
};

export default PaymentTopupButton;
