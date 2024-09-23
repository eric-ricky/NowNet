import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface IUseDeviceModal {
  device?: Doc<"devices">;
  setDevice: (data?: Doc<"devices">) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useDeviceModal = create<IUseDeviceModal>((set) => ({
  device: undefined,
  setDevice: (data?: Doc<"devices">) => set({ device: data }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, device: undefined }),
}));
