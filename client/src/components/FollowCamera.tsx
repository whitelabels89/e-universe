import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MutableRefObject, useRef, useEffect } from "react";
import * as THREE from "three";

function normalizeAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

interface FollowCameraProps {
  position: [number, number, number];
  rotation: number;
  moving: boolean;
  controls: MutableRefObject<OrbitControls | null>;
}

export function FollowCamera({
  position,
  rotation,
  moving,
  controls,
}: FollowCameraProps) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 8, 12);
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
    const [x, y, z] = position;

    if (isDragging.current && controls.current) {
      const angle = Math.atan2(
        camera.position.x - x,
        camera.position.z - z,
      );
      manualYaw.current = normalizeAngle(angle - rotation);
    } else if (moving) {
      manualYaw.current *= 0.9;
      if (Math.abs(manualYaw.current) < 0.001) manualYaw.current = 0;
    }

    const rotOffset = offset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation + manualYaw.current);
    const desiredPos = new THREE.Vector3(
      x - rotOffset.x,
      y + rotOffset.y,
      z - rotOffset.z,
    );
    camPos.current.lerp(desiredPos, 0.03);
    camera.position.copy(camPos.current);

    const desiredTarget = new THREE.Vector3(x, y + 1, z);
    targetPos.current.lerp(desiredTarget, 0.03);
    if (controls.current) {
      controls.current.target.copy(targetPos.current);
      controls.current.update();
    } else {
      camera.lookAt(targetPos.current);
    }
  });

  return null;
}
