import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MutableRefObject, useRef, useEffect } from "react";
import { useCampus } from "../lib/stores/useCampus";
import { useBuildMode } from "../lib/stores/useBuildMode";
import * as THREE from "three";

function normalizeAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

interface FollowCameraProps {
  position: [number, number, number];
  rotation: number;
  moving: boolean;
  controls: MutableRefObject<any>;
}

export function FollowCamera({
  position,
  rotation,
  moving,
  controls,
}: FollowCameraProps) {
  const { camera } = useThree();
  const { isInsideBuilding } = useCampus();
  const { isBuildMode, viewMode } = useBuildMode();
  
  // Different camera behaviors for indoor/outdoor
  const offset = new THREE.Vector3(0, isInsideBuilding ? 4 : 8, isInsideBuilding ? 6 : 12);
  const camPos = useRef(camera.position.clone());
  const targetPos = useRef(new THREE.Vector3());
  const manualYaw = useRef(0);
  const isDragging = useRef(false);

  // Track user interaction with the orbit controls
  useEffect(() => {
    const ctrl = controls.current;
    if (!ctrl) return;
    const start = () => {
      isDragging.current = true;
    };
    const end = () => {
      isDragging.current = false;
    };
    ctrl.addEventListener("start", start);
    ctrl.addEventListener("end", end);
    return () => {
      ctrl.removeEventListener("start", start);
      ctrl.removeEventListener("end", end);
    };
  }, [controls]);

  useFrame(() => {
    // Skip follow camera when in build mode with special views
    if (isBuildMode && (viewMode === 'top' || viewMode === 'bird')) {
      return;
    }

    const [x, y, z] = position;

    // Constrain camera position when inside buildings
    let constrainedX = x;
    let constrainedZ = z;
    
    if (isInsideBuilding) {
      // Keep camera within interior bounds
      const interiorBounds = 6;
      constrainedX = Math.max(-interiorBounds, Math.min(interiorBounds, x));
      constrainedZ = Math.max(-interiorBounds, Math.min(interiorBounds, z));
    }

    if (isDragging.current && controls.current) {
      // Manual control mode - completely disable auto follow
      return; // Exit early, let OrbitControls handle everything
    } else if (moving) {
      // Character is moving - gradually return to follow mode
      manualYaw.current *= isInsideBuilding ? 0.95 : 0.9; // Much slower transition
      if (Math.abs(manualYaw.current) < 0.001) manualYaw.current = 0;
    } else {
      // Character is stationary - maintain manual angle much longer
      manualYaw.current *= 0.995; // Very slow decay when not moving
    }

    // Calculate camera position with hybrid behavior
    const followStrength = moving ? (isInsideBuilding ? 0.12 : 0.05) : (isInsideBuilding ? 0.06 : 0.02);
    const rotOffset = offset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation + manualYaw.current);
    
    const desiredPos = new THREE.Vector3(
      constrainedX - rotOffset.x,
      isInsideBuilding ? y + 2 : y + rotOffset.y, // Lower camera height inside
      constrainedZ - rotOffset.z,
    );

    // Additional constraints for indoor camera
    if (isInsideBuilding) {
      desiredPos.y = Math.max(2, Math.min(6, desiredPos.y)); // Keep camera at reasonable height
      const maxDistance = 6;
      const distanceFromPlayer = Math.sqrt(
        Math.pow(desiredPos.x - constrainedX, 2) + 
        Math.pow(desiredPos.z - constrainedZ, 2)
      );
      if (distanceFromPlayer > maxDistance) {
        const direction = new THREE.Vector3(
          desiredPos.x - constrainedX,
          0,
          desiredPos.z - constrainedZ
        ).normalize();
        desiredPos.x = constrainedX + direction.x * maxDistance;
        desiredPos.z = constrainedZ + direction.z * maxDistance;
      }
    }

    camPos.current.lerp(desiredPos, followStrength);
    camera.position.copy(camPos.current);

    // Target following with smooth transition
    const desiredTarget = new THREE.Vector3(constrainedX, y + (isInsideBuilding ? 0.5 : 1), constrainedZ);
    const targetFollowStrength = moving ? (isInsideBuilding ? 0.08 : 0.05) : (isInsideBuilding ? 0.05 : 0.03);
    targetPos.current.lerp(desiredTarget, targetFollowStrength);
    
    if (controls.current) {
      controls.current.target.copy(targetPos.current);
      controls.current.update();
    } else {
      camera.lookAt(targetPos.current);
    }
  });

  return null;
}
