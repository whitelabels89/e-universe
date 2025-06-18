import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Advanced physics system for object placement and collision
export class TerrainPhysics {
  static raycaster = new THREE.Raycaster();
  static tempVector = new THREE.Vector3();
  static terrainMeshes: THREE.Mesh[] = [];
  
  // Update terrain mesh references with optimization
  static updateTerrainMeshes(scene: THREE.Scene): void {
    // Force update terrain meshes every time untuk memastikan deteksi terrain
    this.terrainMeshes = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.isTerrain) {
        this.terrainMeshes.push(child);
      }
    });
    
    // Disable terrain mesh logging untuk performance
  }
  
  // Get terrain type at position for adaptive mechanics
  static getTerrainType(position: [number, number, number]): string {
    const [x, z] = position;
    const terrainHeight = this.calculateTerrainHeight(x, z);
    
    // Determine terrain type based on height and noise patterns
    if (terrainHeight < -1) return 'water';
    if (terrainHeight < 0.5) return 'sand';
    if (terrainHeight < 2) return 'grass';
    if (terrainHeight < 4) return 'dirt';
    return 'rock';
  }

  // Get jump force multiplier based on terrain type
  static getJumpMultiplier(terrainType: string): number {
    const multipliers: { [key: string]: number } = {
      'water': 0.3,    // Very low jump in water
      'sand': 0.7,     // Reduced jump on sand
      'grass': 1.0,    // Normal jump on grass
      'dirt': 1.1,     // Slightly higher on firm dirt
      'rock': 1.3      // Best jump on solid rock
    };
    return multipliers[terrainType] || 1.0;
  }

  // Get precise ground height at any position using raycast
  static getGroundHeight(position: [number, number, number]): number {
    // Cast ray from high above down to ground
    this.raycaster.set(
      new THREE.Vector3(position[0], 200, position[2]),
      new THREE.Vector3(0, -1, 0)
    );
    
    const intersects = this.raycaster.intersectObjects(this.terrainMeshes, true);
    
    if (intersects.length > 0) {
      // Return the highest intersection point (closest to ray origin)
      return intersects[0].point.y;
    }
    
    // Fallback: calculate height based on terrain generation algorithm
    return this.calculateTerrainHeight(position[0], position[2]);
  }
  
  // Calculate terrain height using the same algorithm as terrain generation
  static calculateTerrainHeight(x: number, z: number): number {
    // Base terrain with gentle hills
    let elevation = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
    
    // Add mountain ranges
    const mountainDistance1 = Math.sqrt((x + 15) ** 2 + (z - 10) ** 2);
    const mountainDistance2 = Math.sqrt((x - 18) ** 2 + (z + 15) ** 2);
    
    if (mountainDistance1 < 8) {
      elevation += (8 - mountainDistance1) * 6;
    }
    if (mountainDistance2 < 6) {
      elevation += (6 - mountainDistance2) * 8;
    }
    
    // Add hills
    elevation += Math.sin(x * 0.8) * Math.cos(z * 0.6) * 3;
    elevation += Math.sin(x * 1.2) * Math.cos(z * 0.9) * 2;
    
    // Create valleys for rivers
    const riverPath1 = Math.abs(Math.sin(x * 0.3) * 5 - z);
    const riverPath2 = Math.abs(Math.cos(z * 0.2) * 6 - x + 10);
    
    if (riverPath1 < 2) {
      elevation -= (2 - riverPath1) * 2;
    }
    if (riverPath2 < 2.5) {
      elevation -= (2.5 - riverPath2) * 1.5;
    }
    
    // Ocean area (lower elevation)
    if (x < -20 || z > 20) {
      elevation = Math.min(elevation, -3);
    }
    
    return Math.max(0, elevation);
  }
  
  // Check if position collides with objects
  static checkCollision(
    position: [number, number, number], 
    radius: number, 
    objects: THREE.Object3D[]
  ): boolean {
    const pos = new THREE.Vector3(...position);
    
    for (const obj of objects) {
      if (obj.userData.isCollidable) {
        const distance = pos.distanceTo(obj.position);
        const objRadius = obj.userData.collisionRadius || 1;
        
        if (distance < radius + objRadius) {
          return true; // Collision detected
        }
      }
    }
    
    return false;
  }
  
  // Snap object to ground surface with proper height offset
  static snapToGround(object: THREE.Object3D): void {
    // For non-character objects, check if position changed significantly
    if (object.userData.lastSnapX !== undefined && object.userData.lastSnapZ !== undefined) {
      const deltaX = Math.abs(object.position.x - object.userData.lastSnapX);
      const deltaZ = Math.abs(object.position.z - object.userData.lastSnapZ);
      if (deltaX < 0.1 && deltaZ < 0.1) {
        return; // No need to recalculate for static objects
      }
    }
    
    const groundHeight = this.getGroundHeight([
      object.position.x, 
      object.position.y, 
      object.position.z
    ]);
    
    const heightOffset = object.userData.heightOffset || 0;
    const newY = groundHeight + heightOffset;
    
    // Always snap to exact height for non-character objects
    object.position.y = newY;
    
    // Cache position for optimization
    object.userData.lastSnapX = object.position.x;
    object.userData.lastSnapZ = object.position.z;
  }
  
  // Snap character to ground with smooth interpolation
  static snapCharacterToGround(
    object: THREE.Object3D, 
    smoothness: number = 0.1
  ): void {
    const groundHeight = this.getGroundHeight([
      object.position.x, 
      object.position.y, 
      object.position.z
    ]);
    
    const heightOffset = object.userData.heightOffset || 0.5;
    const targetY = groundHeight + heightOffset;
    const currentY = object.position.y;
    
    // Snap karakter ke ground level baik naik maupun turun
    const heightDifference = Math.abs(currentY - targetY);
    if (heightDifference < 3.0) { // Maksimal 3 unit perbedaan
      object.position.y = targetY;
    }
  }
  
  // Get surface normal at position for object orientation
  static getSurfaceNormal(position: [number, number, number]): THREE.Vector3 {
    const offset = 0.1;
    const centerHeight = this.getGroundHeight(position);
    const rightHeight = this.getGroundHeight([position[0] + offset, position[1], position[2]]);
    const forwardHeight = this.getGroundHeight([position[0], position[1], position[2] + offset]);
    
    const right = new THREE.Vector3(offset, rightHeight - centerHeight, 0);
    const forward = new THREE.Vector3(0, forwardHeight - centerHeight, offset);
    
    return right.cross(forward).normalize();
  }
  
  // Align object to surface normal
  static alignToSurface(object: THREE.Object3D, position: [number, number, number]): void {
    const normal = this.getSurfaceNormal(position);
    const up = new THREE.Vector3(0, 1, 0);
    
    // Calculate rotation to align with surface
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, normal);
    
    object.quaternion.slerp(quaternion, 0.1);
  }
}

interface PhysicsWorldProps {
  children: React.ReactNode;
}

export function PhysicsWorld({ children }: PhysicsWorldProps) {
  const lastUpdateTime = useRef(0);
  const snapObjects = useRef<THREE.Object3D[]>([]);
  const terrainUpdateCounter = useRef(0);
  
  // Update physics with optimized frequency
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;
    
    // Update terrain meshes every 200ms untuk mengurangi konflik
    if (currentTime - lastUpdateTime.current > 0.2) {
      terrainUpdateCounter.current++;
      
      // Update terrain setiap frame untuk debugging
      TerrainPhysics.updateTerrainMeshes(state.scene);
      
      // Apply surface snapping to all objects that need it
      state.scene.traverse((child) => {
        // Only snap if explicitly enabled and not jumping
        if (child.userData.needsGroundSnap === true && !child.userData.isJumping) {
          if (child.userData.isCharacter) {
            // Characters need constant updates
            TerrainPhysics.snapCharacterToGround(child, 0.5);
          } else {
            // Static objects - less frequent updates
            if (terrainUpdateCounter.current % 10 === 0) {
              TerrainPhysics.snapToGround(child);
            }
          }
        }
      });
      
      lastUpdateTime.current = currentTime;
    }
  });
  
  return <>{children}</>;
}