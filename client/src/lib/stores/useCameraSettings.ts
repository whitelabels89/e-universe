import { create } from 'zustand';

interface CameraSettings {
  // Camera position offsets from character
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  
  // Camera angles
  pitch: number; // Up/down rotation (degrees)
  yaw: number;   // Left/right rotation (degrees)
  
  // Follow behavior
  followDistance: number;
  followHeight: number;
  followSpeed: number;
  
  // Camera modes
  mode: 'follow' | 'free' | 'top-down' | 'first-person';
  
  // Field of view
  fov: number;
  
  // Movement settings
  smoothing: number;
  lookAtTarget: boolean;
  allowOrbitControls: boolean;
}

interface CameraState extends CameraSettings {
  // Actions
  setOffset: (x: number, y: number, z: number) => void;
  setPitch: (pitch: number) => void;
  setYaw: (yaw: number) => void;
  setFollowDistance: (distance: number) => void;
  setFollowHeight: (height: number) => void;
  setFollowSpeed: (speed: number) => void;
  setMode: (mode: CameraSettings['mode']) => void;
  setFOV: (fov: number) => void;
  setSmoothing: (smoothing: number) => void;
  setLookAtTarget: (lookAt: boolean) => void;
  setAllowOrbitControls: (allow: boolean) => void;
  resetToDefault: () => void;
  
  // Presets
  applyPreset: (preset: string) => void;
}

const defaultSettings: CameraSettings = {
  offsetX: 0,
  offsetY: 12,
  offsetZ: 8,
  pitch: -25,
  yaw: 0,
  followDistance: 10,
  followHeight: 8,
  followSpeed: 5,
  mode: 'follow',
  fov: 65,
  smoothing: 0.1,
  lookAtTarget: true,
  allowOrbitControls: true
};

const presets = {
  'default': defaultSettings,
  'top-down': {
    ...defaultSettings,
    offsetY: 20,
    offsetZ: 0,
    pitch: -90,
    mode: 'top-down' as const
  },
  'close-follow': {
    ...defaultSettings,
    offsetY: 6,
    offsetZ: 4,
    followDistance: 5,
    pitch: -15
  },
  'cinematic': {
    ...defaultSettings,
    offsetY: 15,
    offsetZ: 12,
    followDistance: 15,
    pitch: -30,
    smoothing: 0.05
  },
  'first-person': {
    ...defaultSettings,
    offsetY: 2,
    offsetZ: 0,
    pitch: 0,
    mode: 'first-person' as const,
    fov: 75
  }
};

export const useCameraSettings = create<CameraState>((set) => ({
  ...defaultSettings,
  
  setOffset: (x: number, y: number, z: number) => {
    set({ offsetX: x, offsetY: y, offsetZ: z });
  },
  
  setPitch: (pitch: number) => {
    set({ pitch: Math.max(-90, Math.min(90, pitch)) });
  },
  
  setYaw: (yaw: number) => {
    set({ yaw: yaw % 360 });
  },
  
  setFollowDistance: (distance: number) => {
    set({ followDistance: Math.max(1, Math.min(50, distance)) });
  },
  
  setFollowHeight: (height: number) => {
    set({ followHeight: Math.max(1, Math.min(30, height)) });
  },
  
  setFollowSpeed: (speed: number) => {
    set({ followSpeed: Math.max(0.1, Math.min(20, speed)) });
  },
  
  setMode: (mode: CameraSettings['mode']) => {
    set({ mode });
  },
  
  setFOV: (fov: number) => {
    set({ fov: Math.max(30, Math.min(120, fov)) });
  },
  
  setSmoothing: (smoothing: number) => {
    set({ smoothing: Math.max(0.01, Math.min(1, smoothing)) });
  },
  
  setLookAtTarget: (lookAtTarget: boolean) => {
    set({ lookAtTarget });
  },
  
  setAllowOrbitControls: (allowOrbitControls: boolean) => {
    set({ allowOrbitControls });
  },
  
  resetToDefault: () => {
    set(defaultSettings);
  },
  
  applyPreset: (preset: string) => {
    const presetSettings = presets[preset as keyof typeof presets];
    if (presetSettings) {
      set(presetSettings);
    }
  }
}));