import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Building, CAMPUS_BUILDINGS } from "../../types/campus";

interface CampusState {
  buildings: Building[];
  currentInterior: string | null;
  isInsideBuilding: boolean;
  selectedBuilding: Building | null;
  
  // Actions
  enterBuilding: (buildingId: string) => void;
  exitBuilding: () => void;
  unlockBuilding: (buildingId: string) => void;
  getBuildingById: (id: string) => Building | undefined;
  getUnlockedBuildings: () => Building[];
}

export const useCampus = create<CampusState>()(
  subscribeWithSelector((set, get) => ({
    buildings: CAMPUS_BUILDINGS,
    currentInterior: null,
    isInsideBuilding: false,
    selectedBuilding: null,
    
    enterBuilding: (buildingId: string) => {
      const building = get().getBuildingById(buildingId);
      if (building && building.isUnlocked) {
        set({
          currentInterior: building.interiorEnvironment,
          isInsideBuilding: true,
          selectedBuilding: building
        });
        console.log(`Entered ${building.name}`);
      } else {
        console.log(`Cannot enter ${building?.name || 'building'} - locked or not found`);
      }
    },
    
    exitBuilding: () => {
      set({
        currentInterior: null,
        isInsideBuilding: false,
        selectedBuilding: null
      });
      console.log("Exited building");
    },
    
    unlockBuilding: (buildingId: string) => {
      set((state) => ({
        buildings: state.buildings.map(building =>
          building.id === buildingId
            ? { ...building, isUnlocked: true }
            : building
        )
      }));
      console.log(`Unlocked building: ${buildingId}`);
    },
    
    getBuildingById: (id: string) => {
      return get().buildings.find(building => building.id === id);
    },
    
    getUnlockedBuildings: () => {
      return get().buildings.filter(building => building.isUnlocked);
    }
  }))
);