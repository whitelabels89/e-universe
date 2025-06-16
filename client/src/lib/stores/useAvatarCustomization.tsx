import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface AvatarCustomization {
  bodyColor: string;
  headColor: string;
  clothingColor: string;
  hairColor: string;
  eyeColor: string;
  name: string;
}

interface AvatarCustomizationState {
  customization: AvatarCustomization;
  showCustomizationPanel: boolean;
  
  // Actions
  updateBodyColor: (color: string) => void;
  updateHeadColor: (color: string) => void;
  updateClothingColor: (color: string) => void;
  updateHairColor: (color: string) => void;
  updateEyeColor: (color: string) => void;
  updateName: (name: string) => void;
  toggleCustomizationPanel: () => void;
  resetToDefault: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const defaultCustomization: AvatarCustomization = {
  bodyColor: "#FFCC80",
  headColor: "#FFCC80", 
  clothingColor: "#4A90E2",
  hairColor: "#8D6E63",
  eyeColor: "#333333",
  name: "Nina"
};

const STORAGE_KEY = "avatar-customization";

export const useAvatarCustomization = create<AvatarCustomizationState>()(
  subscribeWithSelector((set, get) => ({
    customization: defaultCustomization,
    showCustomizationPanel: false,
    
    updateBodyColor: (color: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          bodyColor: color
        }
      }));
      get().saveToStorage();
    },
    
    updateHeadColor: (color: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          headColor: color
        }
      }));
      get().saveToStorage();
    },
    
    updateClothingColor: (color: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          clothingColor: color
        }
      }));
      get().saveToStorage();
    },
    
    updateHairColor: (color: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          hairColor: color
        }
      }));
      get().saveToStorage();
    },
    
    updateEyeColor: (color: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          eyeColor: color
        }
      }));
      get().saveToStorage();
    },
    
    updateName: (name: string) => {
      set((state) => ({
        customization: {
          ...state.customization,
          name
        }
      }));
      get().saveToStorage();
    },
    
    toggleCustomizationPanel: () => {
      set((state) => ({
        showCustomizationPanel: !state.showCustomizationPanel
      }));
    },
    
    resetToDefault: () => {
      set({ customization: defaultCustomization });
      get().saveToStorage();
    },
    
    saveToStorage: () => {
      try {
        const { customization } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
        console.log("Avatar customization saved:", customization);
      } catch (error) {
        console.error("Failed to save avatar customization:", error);
      }
    },
    
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const customization = JSON.parse(stored);
          set({ customization });
          console.log("Avatar customization loaded:", customization);
        }
      } catch (error) {
        console.error("Failed to load avatar customization:", error);
      }
    }
  }))
);