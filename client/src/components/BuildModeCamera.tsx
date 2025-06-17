import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useBuildMode, ViewMode } from "../lib/stores/useBuildMode";
import * as THREE from "three";

export function BuildModeCamera() {
  const { camera } = useThree();
  const { viewMode, isBuildMode } = useBuildMode();
  const originalPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const originalRotation = useRef<THREE.Euler>(new THREE.Euler());
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetRotation = useRef<THREE.Euler>(new THREE.Euler());
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!isBuildMode) return;

    // Store original camera state
    originalPosition.current.copy(camera.position);
    originalRotation.current.copy(camera.rotation);
    
    // Set target based on view mode
    switch (viewMode) {
      case 'free':
        // Free view - current position but with more freedom
        targetPosition.current.copy(camera.position);
        targetRotation.current.copy(camera.rotation);
        break;
        
      case 'top':
        // 2D top view - directly above looking down
        targetPosition.current.set(0, 50, 0);
        targetRotation.current.set(-Math.PI / 2, 0, 0);
        break;
        
      case 'bird':
        // Perspective bird view - elevated angle
        targetPosition.current.set(0, 25, 25);
        targetRotation.current.set(-Math.PI / 4, 0, 0);
        break;
        
      case 'normal':
        // Return to original position
        targetPosition.current.copy(originalPosition.current);
        targetRotation.current.copy(originalRotation.current);
        break;
    }
    
    isTransitioning.current = true;
  }, [viewMode, isBuildMode, camera]);

  useFrame(() => {
    if (!isTransitioning.current) return;

    // Smooth transition to target camera state
    const lerpFactor = 0.05;
    
    camera.position.lerp(targetPosition.current, lerpFactor);
    
    // Handle rotation interpolation
    const currentQuaternion = camera.quaternion.clone();
    const targetQuaternion = new THREE.Quaternion().setFromEuler(targetRotation.current);
    camera.quaternion.slerp(targetQuaternion, lerpFactor);
    
    // Check if transition is complete
    const positionDistance = camera.position.distanceTo(targetPosition.current);
    const rotationDistance = currentQuaternion.angleTo(targetQuaternion);
    
    if (positionDistance < 0.1 && rotationDistance < 0.01) {
      isTransitioning.current = false;
      camera.position.copy(targetPosition.current);
      camera.quaternion.copy(targetQuaternion);
    }
  });

  return null;
}