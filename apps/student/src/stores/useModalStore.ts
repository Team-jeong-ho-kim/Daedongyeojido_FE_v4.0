import { create } from "zustand";

type useModalStoreType = {
  show: boolean;
  toggleShow: () => void;
};

export const useModalStore = create<useModalStoreType>()((set) => ({
  show: false,
  toggleShow: () => set((state) => ({ show: !state.show })),
}));
