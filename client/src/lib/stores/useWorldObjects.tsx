import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { WorldObject } from "../../types/education";

interface WorldObjectsState {
  objects: WorldObject[];
  selectedPrefab: string | null;
  isPlacementMode: boolean;
  
  // Actions
  addObject: (object: Omit<WorldObject, 'id'>) => void;
  removeObject: (id: string) => void;
  setSelectedPrefab: (prefabId: string | null) => void;
  setPlacementMode: (isActive: boolean) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  clearAll: () => void;
}

const STORAGE_KEY = "educational-world-objects";

export const useWorldObjects = create<WorldObjectsState>()(
  subscribeWithSelector((set, get) => ({
    objects: [],
    selectedPrefab: null,
    isPlacementMode: false,
    
    addObject: (objectData) => {
      const newObject: WorldObject = {
        ...objectData,
        id: `${objectData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      set((state) => ({
        objects: [...state.objects, newObject]
      }));
      
      // Auto-save to localStorage
      setTimeout(() => get().saveToStorage(), 100);
    },
    
    removeObject: (id: string) => {
      set((state) => ({
        objects: state.objects.filter(obj => obj.id !== id)
      }));
      
      // Auto-save to localStorage
      setTimeout(() => get().saveToStorage(), 100);
    },
    
    setSelectedPrefab: (prefabId: string | null) => {
      set({ selectedPrefab: prefabId });
    },
    
    setPlacementMode: (isActive: boolean) => {
      set({ 
        isPlacementMode: isActive,
        selectedPrefab: isActive ? get().selectedPrefab : null
      });
    },
    
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const objects = JSON.parse(stored);
          set({ objects });
          console.log("Loaded objects from storage:", objects);
        }
      } catch (error) {
        console.error("Failed to load objects from storage:", error);
      }
    },
    
    saveToStorage: () => {
      try {
        const { objects } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
        console.log("Saved objects to storage:", objects);
      } catch (error) {
        console.error("Failed to save objects to storage:", error);
      }
    },
    
    clearAll: () => {
      set({ objects: [] });
      localStorage.removeItem(STORAGE_KEY);
    }
  }))
);
