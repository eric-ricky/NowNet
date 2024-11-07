import { create } from "zustand";

interface IUseSupportModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSupportModal = create<IUseSupportModal>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
