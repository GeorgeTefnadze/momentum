import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  openModal: () => set((state) => (!state.isOpen ? { isOpen: true } : state)),
  closeModal: () => set((state) => (state.isOpen ? { isOpen: false } : state)),
}));

export default useModalStore;
