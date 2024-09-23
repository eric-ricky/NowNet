import { create } from "zustand";

interface IPaymentPayload {
  merchant_reference: string; // Id<'payments'>
  redirect_url: string;
  order_tracking_id: string;
}

interface IUsePaymentModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  paymentPayload?: IPaymentPayload;
  setPaymentPayload: (payload?: IPaymentPayload) => void;
}

export const usePaymentModal = create<IUsePaymentModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, paymentPayload: undefined }),
  paymentPayload: undefined,
  setPaymentPayload: (payload?: IPaymentPayload) =>
    set({ paymentPayload: payload }),
}));
