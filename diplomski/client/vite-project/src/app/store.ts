import { create } from 'zustand';

type UiStanje = {
  sidebarSakrij: boolean;
  postaviSidebarSakrij: (v: boolean) => void;
};

export const useUiProdavnica = create<UiStanje>((set) => ({
  sidebarSakrij: false,
  postaviSidebarSakrij: (v) => set({ sidebarSakrij: v })
}));
