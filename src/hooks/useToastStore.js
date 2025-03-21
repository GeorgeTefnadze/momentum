import { create } from "zustand";
import { toast } from "react-hot-toast";

const useToastStore = create((set) => ({
  showSuccess: (message) => {
    toast.success(message);
  },
  showError: (message) => {
    toast.error(message);
  },
}));

export default useToastStore;
