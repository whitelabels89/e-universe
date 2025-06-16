import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  
  // Actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  showAllPanels: () => void;
  hideAllPanels: () => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      showLeftPanel: true,
      showRightPanel: true,
      
      toggleLeftPanel: () => set((state) => ({ showLeftPanel: !state.showLeftPanel })),
      toggleRightPanel: () => set((state) => ({ showRightPanel: !state.showRightPanel })),
      showAllPanels: () => set({ showLeftPanel: true, showRightPanel: true }),
      hideAllPanels: () => set({ showLeftPanel: false, showRightPanel: false }),
    }),
    {
      name: "ui-settings",
    }
  )
);