import { create } from "zustand";

const mainStore = create((set) => ({
  buttonLoading: null,
  setButtonLoading: (value) => set((state) => ({ buttonLoading: value })),

  pageLoading: null,
  setPageLoading: (value) => set((state) => ({ pageLoading: value })),

  componentLoading: null,
  setComponentLoading: (value) => set((state) => ({ componentLoading: value })),
}));

export default mainStore;
