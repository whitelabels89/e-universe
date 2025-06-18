import { create } from 'zustand';

interface DayNightState {
  // Time system
  currentTime: number; // 0-24 hours
  timeSpeed: number; // Multiplier for time progression
  isRunning: boolean;
  
  // Lighting settings
  sunIntensity: number;
  ambientIntensity: number;
  skyColor: string;
  fogColor: string;
  sunPosition: [number, number, number];
  
  // Actions
  setTime: (time: number) => void;
  setTimeSpeed: (speed: number) => void;
  toggleTimeRunning: () => void;
  updateTime: (deltaTime: number) => void;
  resetToDefault: () => void;
}

// Calculate lighting values based on time of day
function calculateLighting(time: number) {
  // Normalize time to 0-1 cycle
  const normalizedTime = time / 24;
  
  // Sun position calculation (circular path)
  const sunAngle = (normalizedTime - 0.25) * Math.PI * 2; // Start at sunrise
  const sunHeight = Math.sin(sunAngle) * 0.8;
  const sunX = Math.cos(sunAngle) * 50;
  const sunY = Math.max(sunHeight * 50, -10);
  const sunZ = Math.sin(sunAngle) * 20;
  
  // Determine if it's day or night
  const isDaytime = sunHeight > 0;
  const dayProgress = Math.max(0, sunHeight);
  
  // Calculate sun intensity
  const sunIntensity = isDaytime ? Math.max(0.3, dayProgress) * 1.5 : 0;
  
  // Calculate ambient light
  const ambientIntensity = isDaytime 
    ? Math.max(0.4, dayProgress * 0.8)
    : Math.max(0.1, Math.abs(sunHeight) * 0.3);
  
  // Sky color transitions
  let skyColor: string;
  let fogColor: string;
  
  if (sunHeight > 0.5) {
    // Midday - bright blue
    skyColor = "#87CEEB";
    fogColor = "#B0E0E6";
  } else if (sunHeight > 0.2) {
    // Morning/afternoon
    skyColor = "#87CEEB";
    fogColor = "#DDA0DD";
  } else if (sunHeight > -0.1) {
    // Sunset/sunrise
    skyColor = "#FF6347";
    fogColor = "#FF8C69";
  } else if (sunHeight > -0.3) {
    // Twilight
    skyColor = "#483D8B";
    fogColor = "#6A5ACD";
  } else {
    // Night
    skyColor = "#191970";
    fogColor = "#2F2F4F";
  }
  
  return {
    sunIntensity,
    ambientIntensity,
    skyColor,
    fogColor,
    sunPosition: [sunX, sunY, sunZ] as [number, number, number]
  };
}

export const useDayNightCycle = create<DayNightState>((set, get) => ({
  // Initial state
  currentTime: 12, // Start at noon
  timeSpeed: 1, // Real-time speed
  isRunning: true,
  
  // Initial lighting (noon)
  ...calculateLighting(12),
  
  // Actions
  setTime: (time: number) => {
    const clampedTime = Math.max(0, Math.min(24, time));
    const lighting = calculateLighting(clampedTime);
    set({ 
      currentTime: clampedTime,
      ...lighting
    });
  },
  
  setTimeSpeed: (speed: number) => {
    set({ timeSpeed: Math.max(0, Math.min(10, speed)) });
  },
  
  toggleTimeRunning: () => {
    set((state) => ({ isRunning: !state.isRunning }));
  },
  
  updateTime: (deltaTime: number) => {
    const state = get();
    if (!state.isRunning) return;
    
    // Update time (deltaTime in seconds, convert to hours)
    const timeIncrement = (deltaTime * state.timeSpeed) / 3600; // 1 hour = 3600 seconds
    const newTime = (state.currentTime + timeIncrement) % 24;
    
    const lighting = calculateLighting(newTime);
    set({ 
      currentTime: newTime,
      ...lighting
    });
  },
  
  resetToDefault: () => {
    const lighting = calculateLighting(12);
    set({
      currentTime: 12,
      timeSpeed: 1,
      isRunning: true,
      ...lighting
    });
  }
}));