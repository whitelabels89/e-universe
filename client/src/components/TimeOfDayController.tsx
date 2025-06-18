import { useFrame } from '@react-three/fiber';
import { useDayNightCycle } from '../lib/stores/useDayNightCycle';

export function TimeOfDayController() {
  const updateTime = useDayNightCycle(state => state.updateTime);
  
  useFrame((state, delta) => {
    // Update time based on frame delta
    updateTime(delta);
  });
  
  return null; // This is a logic-only component
}