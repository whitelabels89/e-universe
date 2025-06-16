import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { StudentProfile } from "../../types/education";

interface EducationState {
  student: StudentProfile;
  
  // Actions
  updateLevel: (newLevel: number) => void;
  unlockArea: (areaId: string) => void;
  completeTask: (taskId: string) => void;
  addScore: (points: number) => void;
  setActiveModule: (module: string) => void;
}

const defaultStudent: StudentProfile = {
  name: "Nina",
  level: 1,
  activeModule: "Digital Literacy",
  unlockedAreas: ["school", "house"],
  completedTasks: [],
  totalScore: 0
};

export const useEducation = create<EducationState>()(
  subscribeWithSelector((set, get) => ({
    student: defaultStudent,
    
    updateLevel: (newLevel: number) => {
      set((state) => ({
        student: {
          ...state.student,
          level: newLevel
        }
      }));
      
      // Auto-unlock areas based on level
      const { student } = get();
      if (newLevel >= 2 && !student.unlockedAreas.includes("coding-lab")) {
        get().unlockArea("coding-lab");
      }
    },
    
    unlockArea: (areaId: string) => {
      set((state) => ({
        student: {
          ...state.student,
          unlockedAreas: [...new Set([...state.student.unlockedAreas, areaId])]
        }
      }));
    },
    
    completeTask: (taskId: string) => {
      set((state) => ({
        student: {
          ...state.student,
          completedTasks: [...new Set([...state.student.completedTasks, taskId])]
        }
      }));
    },
    
    addScore: (points: number) => {
      set((state) => ({
        student: {
          ...state.student,
          totalScore: state.student.totalScore + points
        }
      }));
      
      // Level up logic
      const { student } = get();
      const newTotal = student.totalScore + points;
      const newLevel = Math.floor(newTotal / 100) + 1;
      if (newLevel > student.level) {
        get().updateLevel(newLevel);
      }
    },
    
    setActiveModule: (module: string) => {
      set((state) => ({
        student: {
          ...state.student,
          activeModule: module
        }
      }));
    }
  }))
);
