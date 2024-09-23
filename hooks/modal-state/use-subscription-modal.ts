import { ISubscriptionsData } from "@/lib/types";
import { create } from "zustand";

interface IUseSubscriptionModal {
  subscription?: ISubscriptionsData;
  setSubscription: (data?: ISubscriptionsData) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubscriptionModal = create<IUseSubscriptionModal>((set) => ({
  subscription: undefined,
  setSubscription: (data?: ISubscriptionsData) => set({ subscription: data }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, subscription: undefined }),
}));
