import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type ViewMode = 'normal' | 'free' | 'top' | 'bird';

interface BuildModeState {
  isBuildMode: boolean;
  viewMode: ViewMode;
  previewPosition: [number, number, number] | null;
  selectedBuildingType: string | null;
  
  // Actions
  toggleBuildMode: () => void;
  setViewMode: (mode: ViewMode) => void;
  setPreviewPosition: (position: [number, number, number] | null) => void;
  setSelectedBuildingType: (type: string | null) => void;
  resetBuildMode: () => void;
}

export const useBuildMode = create<BuildModeState>()(
  subscribeWithSelector((set, get) => ({
    isBuildMode: false,
    viewMode: 'normal',
    previewPosition: null,
    selectedBuildingType: null,
    
    toggleBuildMode: () => {
      const current = get().isBuildMode;
      set({ 
        isBuildMode: !current,
        viewMode: current ? 'normal' : 'free' // Switch to free view when entering build mode
      });
      console.log(`Build mode ${!current ? 'enabled' : 'disabled'}`);
    },
    
    setViewMode: (mode: ViewMode) => {
      set({ viewMode: mode });
      console.log(`View mode changed to: ${mode}`);
    },
    
    setPreviewPosition: (position: [number, number, number] | null) => {
      set({ previewPosition: position });
    },
    
    setSelectedBuildingType: (type: string | null) => {
      set({ selectedBuildingType: type });
    },
    
    resetBuildMode: () => {
      set({
        isBuildMode: false,
        viewMode: 'normal',
        previewPosition: null,
        selectedBuildingType: null
      });
    }
  }))
);