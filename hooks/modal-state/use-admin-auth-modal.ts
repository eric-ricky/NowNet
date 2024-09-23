import { create } from "zustand";

interface IAdminAuthModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  onAuthenticate: () => void;
}

export const useAdminAuthModal = create<IAdminAuthModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  onAuthenticate: () => set({ isAuthenticated: true }),
}));
