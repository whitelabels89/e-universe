import { useFrame } from '@react-three/fiber';
import { useDayNightCycle } from '../lib/stores/useDayNightCycle';
import * as THREE from 'three';
import { useRef } from 'react';

export function DynamicSky() {
  const { skyColor, fogColor, sunPosition, sunIntensity } = useDayNightCycle();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  
  useFrame((state) => {
    // Update sun light position
    if (sunRef.current) {
      sunRef.current.position.set(...sunPosition);
      sunRef.current.intensity = sunIntensity;
      sunRef.current.lookAt(0, 0, 0);
    }
    
    // Update scene background and fog
    if (state.scene.background) {
      (state.scene.background as THREE.Color).setStyle(skyColor);
    }
    
    if (state.scene.fog) {
      (state.scene.fog as THREE.Fog).color.setStyle(fogColor);
    }
  });
  
  return (
    <>
      {/* Dynamic background color */}
      <color attach="background" args={[skyColor]} />
      
      {/* Dynamic fog */}
      <fog attach="fog" args={[fogColor, 20, 100]} />
      
      {/* Sun directional light */}
      <directionalLight
        ref={sunRef}
        position={sunPosition}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Ambient light for general illumination */}
      <ambientLight
        ref={ambientRef}
        intensity={useDayNightCycle(state => state.ambientIntensity)}
        color="#ffffff"
      />
      
      {/* Hemisphere light for natural sky lighting */}
      <hemisphereLight
        args={[skyColor, "#8B4513", 0.3]}
      />
    </>
  );
}