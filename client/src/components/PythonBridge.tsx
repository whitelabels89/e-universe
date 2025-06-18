import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useWorldObjects } from '../lib/stores/useWorldObjects';
import { useEnvironment } from '../lib/stores/useEnvironment';
import { showNotification } from './UI/NotificationSystem';

interface PythonBridgeProps {
  onCodeExecute?: (executor: (code: string) => void) => void;
}

interface PythonCommand {
  type: string;
  params: any;
  timestamp: number;
}

export function PythonBridge({ onCodeExecute }: PythonBridgeProps) {
  const { scene } = useThree();
  const { addObject } = useWorldObjects();
  const { setTheme, setWeather } = useEnvironment();
  const commandQueue = useRef<PythonCommand[]>([]);
  const spawnedObjects = useRef<Map<string, THREE.Object3D>>(new Map());

  // Python bridge functions
  const pythonFunctions = {
    // Spawn 3D objects
    spawn_box: (x: number, y: number, z: number, color: string = 'red') => {
      const id = `python_box_${Date.now()}`;
      addObject({
        type: 'house', // Use existing type for compatibility
        position: [x, y, z],
        isUnlocked: true,
        requiredLevel: 1
      });
      
      showNotification(`📦 Box spawned at (${x}, ${y}, ${z})`, 'success');
      return id;
    },

    spawn_sphere: (x: number, y: number, z: number, color: string = 'blue') => {
      const id = `python_sphere_${Date.now()}`;
      
      // Create sphere geometry directly in scene
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: getColorFromName(color) 
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.name = id;
      scene.add(sphere);
      
      spawnedObjects.current.set(id, sphere);
      showNotification(`🔵 Sphere spawned at (${x}, ${y}, ${z})`, 'success');
      return id;
    },

    // Environment controls
    set_background: (color: string) => {
      const bgColor = getColorFromName(color);
      scene.background = new THREE.Color(bgColor);
      showNotification(`🎨 Background changed to ${color}`, 'success');
    },

    set_lighting: (intensity: number = 1.0) => {
      scene.traverse((child) => {
        if (child instanceof THREE.Light) {
          child.intensity = intensity;
        }
      });
      showNotification(`💡 Lighting intensity set to ${intensity}`, 'success');
    },

    // Advanced world operations
    create_building: (x: number, y: number, z: number, type: string = 'school') => {
      const buildingTypes = ['school', 'coding-lab', 'house'];
      const validType = buildingTypes.includes(type) ? type : 'school';
      
      const id = `python_building_${Date.now()}`;
      addObject({
        type: validType as 'school' | 'coding-lab' | 'house',
        position: [x, y, z],
        isUnlocked: true,
        requiredLevel: 1
      });
      
      showNotification(`🏢 ${validType} building created at (${x}, ${y}, ${z})`, 'success');
      return id;
    },

    // Clear all Python-created objects
    clear_scene: () => {
      // Remove Python-spawned objects
      spawnedObjects.current.forEach((object, id) => {
        scene.remove(object);
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      spawnedObjects.current.clear();
      
      showNotification(`🧹 Python objects cleared`, 'success');
    },

    // Environment themes
    set_theme: (themeName: string) => {
      const themes = ['grassland', 'desert', 'snow', 'city', 'island'];
      if (themes.includes(themeName)) {
        setTheme(themeName);
        showNotification(`🌍 Theme changed to ${themeName}`, 'success');
      } else {
        showNotification(`❌ Unknown theme: ${themeName}`, 'error');
      }
    },

    set_weather: (weather: string) => {
      const weathers = ['clear', 'cloudy', 'rainy', 'stormy'];
      if (weathers.includes(weather)) {
        setWeather(weather);
        showNotification(`🌤️ Weather changed to ${weather}`, 'success');
      } else {
        showNotification(`❌ Unknown weather: ${weather}`, 'error');
      }
    },

    // Object manipulation
    move_object: (objectId: string, x: number, y: number, z: number) => {
      const object = spawnedObjects.current.get(objectId);
      if (object) {
        object.position.set(x, y, z);
        showNotification(`🏃 Object moved to (${x}, ${y}, ${z})`, 'success');
      } else {
        showNotification(`❌ Object ${objectId} not found`, 'error');
      }
    },

    // Animation (placeholder)
    add_avatar_animation: (animationType: string) => {
      showNotification(`💃 Avatar animation: ${animationType}`, 'info');
    },

    // Utility functions
    print: (message: string) => {
      console.log(`🐍 Python: ${message}`);
      showNotification(`🐍 ${message}`, 'info');
    }
  };

  // Color name to hex/THREE.Color conversion
  const getColorFromName = (colorName: string): number => {
    const colors: Record<string, number> = {
      'red': 0xff0000,
      'green': 0x00ff00,
      'blue': 0x0000ff,
      'yellow': 0xffff00,
      'purple': 0xff00ff,
      'cyan': 0x00ffff,
      'white': 0xffffff,
      'black': 0x000000,
      'orange': 0xff8000,
      'pink': 0xff80c0,
      'brown': 0x8b4513,
      'gray': 0x808080,
      'darkblue': 0x000080,
      'darkgreen': 0x008000,
      'darkred': 0x800000
    };
    
    return colors[colorName.toLowerCase()] || 0xff0000;
  };

  // Execute Python code by parsing and calling functions
  const executePythonCode = (code: string) => {
    try {
      // Simple parser for Python-like function calls
      const lines = code.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip comments and empty lines
        if (trimmed.startsWith('#') || !trimmed) continue;
        
        // Handle print statements
        if (trimmed.startsWith('print(')) {
          const message = trimmed.match(/print\(['"](.+?)['"]\)/)?.[1] || 'No message';
          pythonFunctions.print(message);
          continue;
        }
        
        // Parse function calls
        const functionMatch = trimmed.match(/(\w+)\((.*)\)/);
        if (functionMatch) {
          const [, functionName, argsString] = functionMatch;
          
          if (functionName in pythonFunctions) {
            try {
              // Parse arguments (simplified)
              const args = parseArguments(argsString);
              (pythonFunctions as any)[functionName](...args);
            } catch (error) {
              showNotification(`❌ Error in ${functionName}: ${error}`, 'error');
            }
          } else {
            showNotification(`❌ Unknown function: ${functionName}`, 'error');
          }
        }
      }
      
      showNotification('✅ Python script executed successfully!', 'success');
      
    } catch (error) {
      showNotification(`❌ Python execution error: ${error}`, 'error');
    }
  };

  // Simple argument parser for Python-like syntax
  const parseArguments = (argsString: string): any[] => {
    if (!argsString.trim()) return [];
    
    const args: any[] = [];
    const parts = argsString.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      
      // Handle keyword arguments (x=1, color='red')
      if (trimmed.includes('=')) {
        const [, value] = trimmed.split('=');
        args.push(parseValue(value.trim()));
      } else {
        args.push(parseValue(trimmed));
      }
    }
    
    return args;
  };

  // Parse individual values
  const parseValue = (value: string): any => {
    // String
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // Number
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    
    // Boolean
    if (value === 'True') return true;
    if (value === 'False') return false;
    
    return value;
  };

  // Set up the bridge
  useEffect(() => {
    if (onCodeExecute) {
      onCodeExecute(executePythonCode);
    }
  }, [onCodeExecute, executePythonCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      spawnedObjects.current.forEach((object) => {
        scene.remove(object);
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      spawnedObjects.current.clear();
    };
  }, [scene]);

  return null; // This component doesn't render anything visible
}