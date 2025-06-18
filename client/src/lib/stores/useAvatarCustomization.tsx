import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface AvatarCustomization {
  // Personal Info
  name: string;
  nickname: string;
  grade: string;
  favoriteSubject: string;
  learningGoal: string;
  
  // Physical Appearance
  bodyColor: string;
  headColor: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  eyeShape: string;
  
  // Clothing & Style
  clothingColor: string;
  clothingStyle: string;
  accessoryColor: string;
  accessoryType: string;
  
  // Personality & Preferences
  personality: string;
  favoriteActivity: string;
  avatar3DModel: string;
  voiceType: string;
  
  // Unlocked Customizations
  unlockedHairStyles: string[];
  unlockedClothingStyles: string[];
  unlockedAccessories: string[];
}

interface AvatarCustomizationState {
  customization: AvatarCustomization;
  showCustomizationPanel: boolean;
  wizardStep: number;
  isWizardMode: boolean;
  
  // Basic Actions
  updateBodyColor: (color: string) => void;
  updateHeadColor: (color: string) => void;
  updateClothingColor: (color: string) => void;
  updateHairColor: (color: string) => void;
  updateEyeColor: (color: string) => void;
  updateName: (name: string) => void;
  
  // Extended Actions
  updateNickname: (nickname: string) => void;
  updateGrade: (grade: string) => void;
  updateFavoriteSubject: (subject: string) => void;
  updateLearningGoal: (goal: string) => void;
  updateHairStyle: (style: string) => void;
  updateEyeShape: (shape: string) => void;
  updateClothingStyle: (style: string) => void;
  updateAccessoryColor: (color: string) => void;
  updateAccessoryType: (type: string) => void;
  updatePersonality: (personality: string) => void;
  updateFavoriteActivity: (activity: string) => void;
  updateAvatar3DModel: (model: string) => void;
  updateVoiceType: (voice: string) => void;
  
  // Wizard Controls
  toggleCustomizationPanel: () => void;
  startWizard: () => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;
  completeWizard: () => void;
  resetToDefault: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  unlockCustomization: (type: string, item: string) => void;
}

const defaultCustomization: AvatarCustomization = {
  // Personal Info
  name: "Nina",
  nickname: "",
  grade: "Grade 6",
  favoriteSubject: "Science",
  learningGoal: "Learn coding and math",
  
  // Physical Appearance
  bodyColor: "#FFCC80",
  headColor: "#FFCC80", 
  hairColor: "#8D6E63",
  hairStyle: "medium",
  eyeColor: "#333333",
  eyeShape: "round",
  
  // Clothing & Style
  clothingColor: "#4A90E2",
  clothingStyle: "casual",
  accessoryColor: "#FF6B6B",
  accessoryType: "none",
  
  // Personality & Preferences
  personality: "curious",
  favoriteActivity: "reading",
  avatar3DModel: "nina_default",
  voiceType: "friendly",
  
  // Unlocked Customizations
  unlockedHairStyles: ["short", "medium"],
  unlockedClothingStyles: ["casual", "formal"],
  unlockedAccessories: ["none", "glasses"]
};

const STORAGE_KEY = "avatar-customization";

export const useAvatarCustomization = create<AvatarCustomizationState>()(
  subscribeWithSelector((set, get) => ({
    customization: defaultCustomization,
    showCustomizationPanel: false,
    wizardStep: 0,
    isWizardMode: false,
    
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
    
    // Extended update methods
    updateNickname: (nickname: string) => {
      set((state) => ({
        customization: { ...state.customization, nickname }
      }));
      get().saveToStorage();
    },
    
    updateGrade: (grade: string) => {
      set((state) => ({
        customization: { ...state.customization, grade }
      }));
      get().saveToStorage();
    },
    
    updateFavoriteSubject: (favoriteSubject: string) => {
      set((state) => ({
        customization: { ...state.customization, favoriteSubject }
      }));
      get().saveToStorage();
    },
    
    updateLearningGoal: (learningGoal: string) => {
      set((state) => ({
        customization: { ...state.customization, learningGoal }
      }));
      get().saveToStorage();
    },
    
    updateHairStyle: (hairStyle: string) => {
      set((state) => ({
        customization: { ...state.customization, hairStyle }
      }));
      get().saveToStorage();
    },
    
    updateEyeShape: (eyeShape: string) => {
      set((state) => ({
        customization: { ...state.customization, eyeShape }
      }));
      get().saveToStorage();
    },
    
    updateClothingStyle: (clothingStyle: string) => {
      set((state) => ({
        customization: { ...state.customization, clothingStyle }
      }));
      get().saveToStorage();
    },
    
    updateAccessoryColor: (accessoryColor: string) => {
      set((state) => ({
        customization: { ...state.customization, accessoryColor }
      }));
      get().saveToStorage();
    },
    
    updateAccessoryType: (accessoryType: string) => {
      set((state) => ({
        customization: { ...state.customization, accessoryType }
      }));
      get().saveToStorage();
    },
    
    updatePersonality: (personality: string) => {
      set((state) => ({
        customization: { ...state.customization, personality }
      }));
      get().saveToStorage();
    },
    
    updateFavoriteActivity: (favoriteActivity: string) => {
      set((state) => ({
        customization: { ...state.customization, favoriteActivity }
      }));
      get().saveToStorage();
    },
    
    updateAvatar3DModel: (avatar3DModel: string) => {
      set((state) => ({
        customization: { ...state.customization, avatar3DModel }
      }));
      get().saveToStorage();
    },
    
    updateVoiceType: (voiceType: string) => {
      set((state) => ({
        customization: { ...state.customization, voiceType }
      }));
      get().saveToStorage();
    },
    
    toggleCustomizationPanel: () => {
      set((state) => ({
        showCustomizationPanel: !state.showCustomizationPanel,
        isWizardMode: false,
        wizardStep: 0
      }));
    },
    
    startWizard: () => {
      set({
        showCustomizationPanel: true,
        isWizardMode: true,
        wizardStep: 0
      });
    },
    
    nextWizardStep: () => {
      set((state) => ({
        wizardStep: Math.min(state.wizardStep + 1, 5)
      }));
    },
    
    prevWizardStep: () => {
      set((state) => ({
        wizardStep: Math.max(state.wizardStep - 1, 0)
      }));
    },
    
    completeWizard: () => {
      set({
        isWizardMode: false,
        showCustomizationPanel: false,
        wizardStep: 0
      });
      get().saveToStorage();
    },
    
    resetToDefault: () => {
      set({ customization: defaultCustomization });
      get().saveToStorage();
    },
    
    unlockCustomization: (type: string, item: string) => {
      set((state) => {
        const customization = { ...state.customization };
        if (type === 'hairStyle' && !customization.unlockedHairStyles.includes(item)) {
          customization.unlockedHairStyles.push(item);
        } else if (type === 'clothingStyle' && !customization.unlockedClothingStyles.includes(item)) {
          customization.unlockedClothingStyles.push(item);
        } else if (type === 'accessory' && !customization.unlockedAccessories.includes(item)) {
          customization.unlockedAccessories.push(item);
        }
        return { customization };
      });
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