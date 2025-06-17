import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MutableRefObject } from "react";
import * as THREE from "three";

interface FollowCameraProps {
  position: [number, number, number];
  rotation: number;
  controls: MutableRefObject<OrbitControls | null>;
}

export function FollowCamera({ position, rotation, controls }: FollowCameraProps) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 8, 12);

  useFrame(() => {
    const [x, y, z] = position;
    const rotatedOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    camera.position.set(x - rotatedOffset.x, y + rotatedOffset.y, z - rotatedOffset.z);

    if (controls.current) {
      controls.current.target.set(x, y + 1, z);
      controls.current.update();
    }
  });

  return null;
}


