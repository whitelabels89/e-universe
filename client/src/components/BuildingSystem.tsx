import { useMemo, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useEnvironment } from "../lib/stores/useEnvironment";
import { useBuildMode } from "../lib/stores/useBuildMode";
import * as THREE from "three";

interface BuildingSystemProps {
  size?: number;
}

export function BuildingSystem({ size = 30 }: BuildingSystemProps) {
  const { getCurrentTheme } = useEnvironment();
  const { isBuildMode } = useBuildMode();
  const theme = getCurrentTheme();

  if (!isBuildMode) return null;

  return (
    <group>
      <ThemeSpecificBuildings theme={theme} size={size} />
    </group>
  );
}

function ThemeSpecificBuildings({ theme, size }: { theme: any; size: number }) {
  const buildings = useMemo(() => {
    const buildingList = [];
    
    // Generate theme-specific buildings
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * size * 0.4;
      const z = (Math.random() - 0.5) * size * 0.4;
      const buildingType = getBuildingTypeForTheme(theme?.id || 'grassland');
      
      buildingList.push({
        x,
        z,
        type: buildingType,
        id: `building-${i}`
      });
    }
    
    return buildingList;
  }, [theme, size]);

  return (
    <group>
      {buildings.map((building) => (
        <ThemeBuilding
          key={building.id}
          position={[building.x, 2, building.z]}
          type={building.type}
          theme={theme}
        />
      ))}
    </group>
  );
}

function getBuildingTypeForTheme(themeId: string): string {
  switch (themeId) {
    case 'desert':
      return ['adobe_house', 'oasis_tower', 'sand_fort'][Math.floor(Math.random() * 3)];
    case 'island':
      return ['beach_hut', 'lighthouse', 'tiki_house'][Math.floor(Math.random() * 3)];
    case 'snow':
      return ['igloo', 'cabin', 'ice_castle'][Math.floor(Math.random() * 3)];
    case 'city':
      return ['skyscraper', 'office_building', 'apartment'][Math.floor(Math.random() * 3)];
    case 'mountain':
      return ['mountain_lodge', 'watchtower', 'stone_house'][Math.floor(Math.random() * 3)];
    default:
      return ['cottage', 'barn', 'windmill'][Math.floor(Math.random() * 3)];
  }
}

function ThemeBuilding({ position, type, theme }: { 
  position: [number, number, number]; 
  type: string; 
  theme: any; 
}) {
  const baseColor = theme?.terrainColor || "#708090";
  const accentColor = theme?.skyColor || "#87CEEB";
  
  // Buildings auto-snap to terrain
  const buildingUserData = {
    needsGroundSnap: true,
    heightOffset: 0,
    isCollidable: true,
    collisionRadius: 2
  };

  switch (type) {
    case 'adobe_house':
      return (
        <group position={position} userData={buildingUserData}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[3, 2, 3]} />
            <meshLambertMaterial color="#D2691E" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[1.8, 1.8, 1, 8]} />
            <meshLambertMaterial color="#CD853F" />
          </mesh>
        </group>
      );
      
    case 'beach_hut':
      return (
        <group position={position}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2.5, 2, 2.5]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
          <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI/4, 0]}>
            <coneGeometry args={[2, 1]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        </group>
      );
      
    case 'igloo':
      return (
        <group position={position}>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI/2]} />
            <meshLambertMaterial color="#F0F8FF" />
          </mesh>
        </group>
      );
      
    case 'skyscraper':
      return (
        <group position={position}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[2, 8, 2]} />
            <meshLambertMaterial color="#708090" />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <boxGeometry args={[1.8, 1, 1.8]} />
            <meshLambertMaterial color="#2F4F4F" />
          </mesh>
        </group>
      );
      
    case 'mountain_lodge':
      return (
        <group position={position}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[3, 2, 2.5]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2.7, 0]} rotation={[Math.PI/4, 0, 0]}>
            <boxGeometry args={[3.2, 0.2, 3]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
        </group>
      );
      
    case 'cottage':
      return (
        <group position={position}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2.5, 2, 2]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI/4, 0, 0]}>
            <boxGeometry args={[2.7, 0.2, 2.5]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        </group>
      );
      
    default:
      return (
        <group position={position} userData={buildingUserData}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshLambertMaterial color={baseColor} />
          </mesh>
        </group>
      );
  }
}

// Building Templates for Drag & Drop System
export const BUILDING_TEMPLATES = {
  residential: {
    desert: [
      { id: 'adobe_house', name: 'Adobe House', description: 'Traditional desert dwelling' },
      { id: 'oasis_tower', name: 'Oasis Tower', description: 'Tall structure for water storage' },
      { id: 'sand_fort', name: 'Sand Fort', description: 'Defensive desert structure' }
    ],
    island: [
      { id: 'beach_hut', name: 'Beach Hut', description: 'Tropical beach dwelling' },
      { id: 'lighthouse', name: 'Lighthouse', description: 'Navigation beacon' },
      { id: 'tiki_house', name: 'Tiki House', description: 'Traditional island home' }
    ],
    snow: [
      { id: 'igloo', name: 'Igloo', description: 'Ice dome shelter' },
      { id: 'cabin', name: 'Log Cabin', description: 'Warm wooden shelter' },
      { id: 'ice_castle', name: 'Ice Castle', description: 'Majestic frozen palace' }
    ],
    city: [
      { id: 'skyscraper', name: 'Skyscraper', description: 'Tall office building' },
      { id: 'apartment', name: 'Apartment', description: 'Residential complex' },
      { id: 'office_building', name: 'Office Building', description: 'Commercial structure' }
    ],
    mountain: [
      { id: 'mountain_lodge', name: 'Mountain Lodge', description: 'Alpine retreat' },
      { id: 'watchtower', name: 'Watchtower', description: 'Strategic observation post' },
      { id: 'stone_house', name: 'Stone House', description: 'Durable rock dwelling' }
    ],
    grassland: [
      { id: 'cottage', name: 'Cottage', description: 'Cozy countryside home' },
      { id: 'barn', name: 'Barn', description: 'Agricultural storage' },
      { id: 'windmill', name: 'Windmill', description: 'Wind-powered mill' }
    ]
  },
  commercial: {
    desert: [
      { id: 'bazaar', name: 'Desert Bazaar', description: 'Trading marketplace' },
      { id: 'caravanserai', name: 'Caravanserai', description: 'Traveler inn' }
    ],
    island: [
      { id: 'resort', name: 'Beach Resort', description: 'Tourist accommodation' },
      { id: 'pier', name: 'Fishing Pier', description: 'Dock for boats' }
    ],
    snow: [
      { id: 'ski_lodge', name: 'Ski Lodge', description: 'Winter sports center' },
      { id: 'ice_rink', name: 'Ice Rink', description: 'Skating facility' }
    ],
    city: [
      { id: 'mall', name: 'Shopping Mall', description: 'Large retail center' },
      { id: 'bank', name: 'Bank', description: 'Financial institution' }
    ],
    mountain: [
      { id: 'mining_station', name: 'Mining Station', description: 'Resource extraction' },
      { id: 'cable_car', name: 'Cable Car Station', description: 'Mountain transport' }
    ],
    grassland: [
      { id: 'market', name: 'Village Market', description: 'Local trading post' },
      { id: 'inn', name: 'Country Inn', description: 'Rural hospitality' }
    ]
  },
  decorative: {
    desert: [
      { id: 'obelisk', name: 'Obelisk', description: 'Ancient monument' },
      { id: 'cactus_garden', name: 'Cactus Garden', description: 'Desert landscaping' }
    ],
    island: [
      { id: 'palm_grove', name: 'Palm Grove', description: 'Tropical trees' },
      { id: 'volcano', name: 'Volcano', description: 'Geological feature' }
    ],
    snow: [
      { id: 'ice_sculpture', name: 'Ice Sculpture', description: 'Frozen art' },
      { id: 'snow_fort', name: 'Snow Fort', description: 'Playful structure' }
    ],
    city: [
      { id: 'fountain', name: 'City Fountain', description: 'Urban water feature' },
      { id: 'statue', name: 'Monument', description: 'Memorial statue' }
    ],
    mountain: [
      { id: 'stone_circle', name: 'Stone Circle', description: 'Ancient ritual site' },
      { id: 'cave_entrance', name: 'Cave Entrance', description: 'Mountain cave' }
    ],
    grassland: [
      { id: 'flower_field', name: 'Flower Field', description: 'Colorful meadow' },
      { id: 'well', name: 'Village Well', description: 'Water source' }
    ]
  }
};