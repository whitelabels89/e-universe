import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MutableRefObject, useRef } from "react";
import * as THREE from "three";

interface FollowCameraProps {
  position: [number, number, number];
  rotation: number;
  controls: MutableRefObject<OrbitControls | null>;
}

export function FollowCamera({
  position,
  rotation,
  controls,
}: FollowCameraProps) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 8, 12);
  const camPos = useRef(camera.position.clone());
  const targetPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const [x, y, z] = position;
    const rotOffset = offset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
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
