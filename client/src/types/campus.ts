export interface Building {
  id: string;
  name: string;
  type: 'lab-coding' | 'library' | 'robotic' | 'garden' | 'farm' | 'studio-art';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description: string;
  isUnlocked: boolean;
  requiredLevel: number;
  interiorEnvironment: string;
}

export interface InteriorEnvironment {
  id: string;
  name: string;
  backgroundColor: string;
  fogColor: string;
  ambientLightIntensity: number;
  directionalLightColor: string;
  floorTexture?: string;
  wallTexture?: string;
  decorativeElements: DecorativeElement[];
}

export interface DecorativeElement {
  type: 'computer' | 'book' | 'robot' | 'plant' | 'easel' | 'desk' | 'chair';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
}

export const CAMPUS_BUILDINGS: Building[] = [
  {
    id: 'lab-coding',
    name: 'Lab Coding',
    type: 'lab-coding',
    position: [-15, 0, -15],
    size: [8, 6, 8],
    color: '#00FF88',
    description: 'Tempat belajar programming dan teknologi',
    isUnlocked: true,
    requiredLevel: 1,
    interiorEnvironment: 'coding-lab'
  },
  {
    id: 'library',
    name: 'Perpustakaan',
    type: 'library',
    position: [15, 0, -15],
    size: [10, 8, 10],
    color: '#8B4513',
    description: 'Perpustakaan digital dengan koleksi buku lengkap',
    isUnlocked: true,
    requiredLevel: 1,
    interiorEnvironment: 'library'
  },
  {
    id: 'robotic',
    name: 'Lab Robotik',
    type: 'robotic',
    position: [-15, 0, 15],
    size: [8, 6, 8],
    color: '#FF6B35',
    description: 'Workshop robotik dan engineering',
    isUnlocked: false,
    requiredLevel: 3,
    interiorEnvironment: 'robotic-lab'
  },
  {
    id: 'garden',
    name: 'Taman Edukasi',
    type: 'garden',
    position: [0, 0, -40],
    size: [12, 4, 8],
    color: '#32CD32',
    description: 'Taman untuk belajar biologi dan ekologi',
    isUnlocked: true,
    requiredLevel: 1,
    interiorEnvironment: 'garden'
  },
  {
    id: 'farm',
    name: 'Kebun Percobaan',
    type: 'farm',
    position: [40, 0, 0],
    size: [10, 4, 10],
    color: '#8FBC8F',
    description: 'Area pertanian untuk pembelajaran praktis',
    isUnlocked: false,
    requiredLevel: 2,
    interiorEnvironment: 'farm'
  },
  {
    id: 'studio-art',
    name: 'Studio Seni',
    type: 'studio-art',
    position: [-40, 0, 0],
    size: [8, 6, 8],
    color: '#DA70D6',
    description: 'Studio kreatif untuk seni dan desain',
    isUnlocked: false,
    requiredLevel: 2,
    interiorEnvironment: 'art-studio'
  }
];

export const INTERIOR_ENVIRONMENTS: Record<string, InteriorEnvironment> = {
  'coding-lab': {
    id: 'coding-lab',
    name: 'Lab Coding',
    backgroundColor: '#1a1a2e',
    fogColor: '#16213e',
    ambientLightIntensity: 0.6,
    directionalLightColor: '#00ff88',
    decorativeElements: [
      { type: 'computer', position: [-3, 1, -3], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'computer', position: [3, 1, -3], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'desk', position: [-3, 0, -3], rotation: [0, 0, 0], scale: [2, 1, 1] },
      { type: 'desk', position: [3, 0, -3], rotation: [0, 0, 0], scale: [2, 1, 1] },
      { type: 'chair', position: [-3, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'chair', position: [3, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] }
    ]
  },
  'library': {
    id: 'library',
    name: 'Perpustakaan',
    backgroundColor: '#8B4513',
    fogColor: '#D2691E',
    ambientLightIntensity: 0.8,
    directionalLightColor: '#FFD700',
    decorativeElements: [
      { type: 'book', position: [-4, 2, -4], rotation: [0, 0, 0], scale: [1, 3, 1] },
      { type: 'book', position: [4, 2, -4], rotation: [0, 0, 0], scale: [1, 3, 1] },
      { type: 'book', position: [-4, 2, 4], rotation: [0, 0, 0], scale: [1, 3, 1] },
      { type: 'book', position: [4, 2, 4], rotation: [0, 0, 0], scale: [1, 3, 1] },
      { type: 'desk', position: [0, 0, 0], rotation: [0, 0, 0], scale: [3, 1, 2] },
      { type: 'chair', position: [0, 0, 1], rotation: [0, Math.PI, 0], scale: [1, 1, 1] }
    ]
  },
  'robotic-lab': {
    id: 'robotic-lab',
    name: 'Lab Robotik',
    backgroundColor: '#2C3E50',
    fogColor: '#34495E',
    ambientLightIntensity: 0.5,
    directionalLightColor: '#FF6B35',
    decorativeElements: [
      { type: 'robot', position: [-2, 1, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'robot', position: [2, 1, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'desk', position: [0, 0, 3], rotation: [0, 0, 0], scale: [4, 1, 1.5] },
      { type: 'chair', position: [0, 0, 4], rotation: [0, Math.PI, 0], scale: [1, 1, 1] }
    ]
  },
  'garden': {
    id: 'garden',
    name: 'Taman Edukasi',
    backgroundColor: '#228B22',
    fogColor: '#90EE90',
    ambientLightIntensity: 0.9,
    directionalLightColor: '#FFFF00',
    decorativeElements: [
      { type: 'plant', position: [-3, 0, -3], rotation: [0, 0, 0], scale: [1, 2, 1] },
      { type: 'plant', position: [3, 0, -3], rotation: [0, 0, 0], scale: [1, 1.5, 1] },
      { type: 'plant', position: [-3, 0, 3], rotation: [0, 0, 0], scale: [1, 1.8, 1] },
      { type: 'plant', position: [3, 0, 3], rotation: [0, 0, 0], scale: [1, 2.2, 1] },
      { type: 'plant', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
    ]
  },
  'farm': {
    id: 'farm',
    name: 'Kebun Percobaan',
    backgroundColor: '#8FBC8F',
    fogColor: '#F0E68C',
    ambientLightIntensity: 0.9,
    directionalLightColor: '#FFD700',
    decorativeElements: [
      { type: 'plant', position: [-4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [-2, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [0, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [2, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [4, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [-4, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [-2, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [0, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [2, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'plant', position: [4, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] }
    ]
  },
  'art-studio': {
    id: 'art-studio',
    name: 'Studio Seni',
    backgroundColor: '#DDA0DD',
    fogColor: '#E6E6FA',
    ambientLightIntensity: 0.8,
    directionalLightColor: '#DA70D6',
    decorativeElements: [
      { type: 'easel', position: [-2, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'easel', position: [2, 0, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'desk', position: [0, 0, 3], rotation: [0, 0, 0], scale: [3, 1, 1] },
      { type: 'chair', position: [-2, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1] },
      { type: 'chair', position: [2, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1] }
    ]
  }
};