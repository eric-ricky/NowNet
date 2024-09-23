import { create } from "zustand";

interface IUseWidthrawalModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useWidthrawalModal = create<IUseWidthrawalModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
