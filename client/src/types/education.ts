export interface StudentProfile {
  name: string;
  level: number;
  activeModule: string;
  unlockedAreas: string[];
  completedTasks: string[];
  totalScore: number;
}

export interface WorldObject {
  id: string;
  type: 'school' | 'coding-lab' | 'house';
  position: [number, number, number];
  isUnlocked: boolean;
  requiredLevel: number;
}

export interface PrefabType {
  id: string;
  name: string;
  type: 'school' | 'coding-lab' | 'house';
  color: string;
  requiredLevel: number;
  description: string;
}

export const PREFAB_TYPES: PrefabType[] = [
  {
    id: 'school',
    name: 'School',
    type: 'school',
    color: '#4CAF50',
    requiredLevel: 1,
    description: 'Basic learning environment'
  },
  {
    id: 'coding-lab',
    name: 'Coding Lab',
    type: 'coding-lab',
    color: '#2196F3',
    requiredLevel: 2,
    description: 'Advanced programming workspace'
  },
  {
    id: 'house',
    name: 'House',
    type: 'house',
    color: '#FF9800',
    requiredLevel: 1,
    description: 'Personal study space'
  }
];
