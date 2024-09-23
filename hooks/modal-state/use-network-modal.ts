import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface IUseNetworkModal {
  network?: Doc<"wifis">;
  setNetwork: (data?: Doc<"wifis">) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNetworkModal = create<IUseNetworkModal>((set) => ({
  network: undefined,
  setNetwork: (data?: Doc<"wifis">) => set({ network: data }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, network: undefined }),
}));
