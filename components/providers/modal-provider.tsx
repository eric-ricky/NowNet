"use client";

import { useConvexAuth } from "convex/react";
import { useIsMounted } from "usehooks-ts";
import AdminAuthModal from "../modals/admin-auth-modal";
import DeviceModal from "../modals/device-modal";
import NetworkModal from "../modals/network-modal";
import PaymentModal from "../modals/payment-modal";
import SubscriptionModal from "../modals/subscription-modal";
import WidthrawalModal from "../modals/widthrawal-modal";

const ModalProvider = () => {
  const { isAuthenticated } = useConvexAuth();
  const isMounted = useIsMounted();

  if (!isMounted) return;

  return (
    <>
      {isAuthenticated && (
        <>
          <AdminAuthModal />
          <DeviceModal />
          <NetworkModal />
          <SubscriptionModal />
          <PaymentModal />
          <WidthrawalModal />
        </>
      )}
    </>
  );
};

export default ModalProvider;
