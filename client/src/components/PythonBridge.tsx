import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useWorldObjects } from '../lib/stores/useWorldObjects';
import { useEnvironment } from '../lib/stores/useEnvironment';
import { showNotification } from './UI/NotificationSystem';
import { CreativeEngine } from '../lib/CreativeEngine';

interface PythonBridgeProps {
  onCodeExecute?: (executor: (code: string) => void) => void;
}

interface PythonCommand {
  type: string;
  params: any;
  timestamp: number;
}

export function PythonBridge({ onCodeExecute }: PythonBridgeProps) {
  const { scene, camera } = useThree();
  const { addObject } = useWorldObjects();
  const { setTheme, setWeather } = useEnvironment();
  const commandQueue = useRef<PythonCommand[]>([]);
  const spawnedObjects = useRef<Map<string, THREE.Object3D>>(new Map());
  const creativeEngine = useRef<CreativeEngine | null>(null);
  
  // Track avatar position in real-time
  const avatarPosition = useRef<[number, number, number]>([0, 1, 0]);
  const avatarRotation = useRef<number>(0);

  // Update avatar position tracking every frame
  useFrame(() => {
    // Find avatar and update position tracking
    const avatar = scene.getObjectByName('animated-avatar');
    if (avatar) {
      avatarPosition.current = [avatar.position.x, avatar.position.y, avatar.position.z];
      avatarRotation.current = avatar.rotation.y;
    }
  });

  // Function to get spawn position in front of avatar
  const getSpawnPositionInFront = (offsetDistance = 3) => {
    console.log('🔍 Getting spawn position...');
    console.log('🎯 Current avatar position:', avatarPosition.current);
    console.log('🎯 Current avatar rotation:', avatarRotation.current);
    
    // Check if we have a valid avatar position (not at origin)
    const [avatarX, avatarY, avatarZ] = avatarPosition.current;
    if (avatarX === 0 && avatarY === 1 && avatarZ === 0) {
      console.log('⚠️ Avatar position seems to be at default, using offset from center');
      // Avatar might not be tracked yet, use a reasonable spawn position
      return [offsetDistance, 1, 0];
    }
    
    const avatarRot = avatarRotation.current;
    
    // Calculate position in front of avatar based on rotation
    const frontX = avatarX + Math.sin(avatarRot) * offsetDistance;
    const frontZ = avatarZ + Math.cos(avatarRot) * offsetDistance;
    
    const spawnPosition: [number, number, number] = [frontX, avatarY + 0.5, frontZ];
    
    console.log('🎯 Spawning in front at:', spawnPosition);
    return spawnPosition;
  };

  // Python bridge functions
  const pythonFunctions = {
    // Spawn 3D objects
    spawn_box: (x?: number, y?: number, z?: number, color: string = 'red') => {
      const id = `python_box_${Date.now()}`;
      
      // Auto-position in front of avatar if no coordinates provided
      let finalPosition: [number, number, number];
      if (x === undefined && y === undefined && z === undefined) {
        finalPosition = getSpawnPositionInFront();
        console.log('📦 Auto-positioning box in front of avatar at:', finalPosition);
      } else {
        finalPosition = [x || 0, y || 0, z || 0];
      }
      
      addObject({
        type: 'house', // Use existing type for compatibility
        position: finalPosition,
        isUnlocked: true,
        requiredLevel: 1
      });
      
      showNotification(`📦 Box spawned in front of you!`, 'success');
      return id;
    },

    spawn_sphere: (x?: number, y?: number, z?: number, color: string = 'blue') => {
      const id = `python_sphere_${Date.now()}`;
      
      // Auto-position in front of avatar if no coordinates provided
      let finalPosition: [number, number, number];
      if (x === undefined && y === undefined && z === undefined) {
        finalPosition = getSpawnPositionInFront();
        console.log('🔵 Auto-positioning sphere in front of avatar at:', finalPosition);
      } else {
        finalPosition = [x || 0, y || 0, z || 0];
      }
      
      // Create sphere geometry directly in scene
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: getColorFromName(color) 
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(finalPosition[0], finalPosition[1], finalPosition[2]);
      sphere.name = id;
      scene.add(sphere);
      
      spawnedObjects.current.set(id, sphere);
      showNotification(`🔵 Sphere spawned in front of you!`, 'success');
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

  // Execute Python code using direct function parsing and Creative Engine
  const executePythonCode = async (code: string) => {
    try {
      console.log('🐍 Executing Python code:', code);
      
      // Initialize Creative Engine if not already done
      if (!creativeEngine.current) {
        creativeEngine.current = new CreativeEngine(scene);
        console.log('🚀 Creative Engine initialized during execution');
      }

      // Enhanced Python function implementations
      const enhancedPythonFunctions = {
        ...pythonFunctions,
        
        // Add a helper function that users can call for positioning
        get_avatar_position: () => {
          return avatarPosition.current;
        },
        
        get_spawn_position_front: (distance = 3) => {
          return getSpawnPositionInFront(distance);
        },
        
        define_shape: (name: string, config: any) => {
          console.log('🛠️ Python calling define_shape with name:', name);
          console.log('🛠️ Config received:', config);
          console.log('🛠️ Config type:', typeof config);
          console.log('🛠️ Config vertices:', config?.vertices);
          
          if (!creativeEngine.current) {
            console.error('❌ Creative Engine not initialized');
            return false;
          }
          
          try {
            const shapeConfig = {
              vertices: config.vertices || [],
              color: config.color || '#FF0000',
              height: config.height || 1
            };
            console.log('🛠️ Final shape config:', shapeConfig);
            
            const result = creativeEngine.current.defineShape(name, shapeConfig);
            console.log('🛠️ defineShape result:', result);
            
            if (result) {
              showNotification(`Shape "${name}" defined!`, 'success');
              // Trigger creative mode hint
              window.dispatchEvent(new CustomEvent('creative_mode_active'));
            } else {
              showNotification(`Failed to define shape "${name}"`, 'error');
            }
            return result;
          } catch (error) {
            console.error('❌ Error defining shape:', error);
            showNotification(`Error defining shape: ${error}`, 'error');
            return false;
          }
        },

        spawn_custom: (shapeName: string, x?: number, y?: number, z?: number) => {
          console.log('🎯 Python calling spawn_custom with shapeName:', shapeName);
          console.log('🎯 Parameters received - x:', x, 'y:', y, 'z:', z);
          
          // Auto-position in front of avatar if no coordinates provided
          let finalPosition: [number, number, number];
          if (x === undefined && y === undefined && z === undefined) {
            finalPosition = getSpawnPositionInFront();
            console.log('🎯 Auto-positioning in front of avatar at:', finalPosition);
          } else {
            finalPosition = [x || 0, y || 0, z || 0];
            console.log('🎯 Using provided position:', finalPosition);
          }
          
          console.log('🎯 Available shapes:', window.blueprintShapes ? Object.keys(window.blueprintShapes) : 'None');
          
          if (!creativeEngine.current) {
            console.error('❌ Creative Engine not initialized');
            return null;
          }
          
          try {
            const result = creativeEngine.current.spawnCustomShape(shapeName, finalPosition[0], finalPosition[1], finalPosition[2]);
            console.log('🎯 spawnCustomShape result:', result);
            
            if (result) {
              showNotification(`Custom shape "${shapeName}" spawned in front of you!`, 'success');
            } else {
              showNotification(`Shape "${shapeName}" not found. Define it first!`, 'error');
            }
            return result;
          } catch (error) {
            console.error('❌ Error spawning custom shape:', error);
            showNotification(`Error spawning shape: ${error}`, 'error');
            return null;
          }
        },

        define_npc: (name: string, config: any) => {
          console.log('🤖 Python calling define_npc:', name, config);
          if (!creativeEngine.current) return false;
          
          try {
            const result = creativeEngine.current.defineNPC(name, {
              scale: config.scale || [1, 1, 1],
              message: config.message || 'Hello!',
              color: config.color || '#00FF00'
            });
            showNotification(`NPC "${name}" defined!`, 'success');
            return result;
          } catch (error) {
            console.error('❌ Error defining NPC:', error);
            showNotification(`Error defining NPC: ${error}`, 'error');
            return false;
          }
        },

        spawn_npc: (npcName: string, x?: number, y?: number, z?: number) => {
          console.log('🤖 Python calling spawn_npc:', npcName);
          console.log('🤖 Parameters received - x:', x, 'y:', y, 'z:', z);
          console.log('🤖 Parameter types - x:', typeof x, 'y:', typeof y, 'z:', typeof z);
          
          // Auto-position in front of avatar if no coordinates provided
          let finalPosition: [number, number, number];
          if (x === undefined && y === undefined && z === undefined) {
            finalPosition = getSpawnPositionInFront(4); // NPCs spawn a bit further
            console.log('🤖 Auto-positioning NPC in front of avatar at:', finalPosition);
          } else {
            finalPosition = [x || 0, y || 0, z || 0];
            console.log('🤖 Using provided position:', finalPosition);
          }
          
          if (!creativeEngine.current) return null;
          
          try {
            const result = creativeEngine.current.spawnCustomNPC(npcName, finalPosition[0], finalPosition[1], finalPosition[2]);
            if (result) {
              showNotification(`NPC "${npcName}" spawned in front of you!`, 'success');
            } else {
              showNotification(`NPC "${npcName}" not found. Define it first!`, 'error');
            }
            return result;
          } catch (error) {
            console.error('❌ Error spawning NPC:', error);
            showNotification(`Error spawning NPC: ${error}`, 'error');
            return null;
          }
        }
      };

      // Parse and execute Python-like code with multi-line function support
      const cleanedCode = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      // Find function calls that might span multiple lines
      const functionCalls = [];
      let currentCall = '';
      let inFunction = false;
      let braceCount = 0;
      let parenCount = 0;
      
      const lines = cleanedCode.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip comments and empty lines when not in function
        if (!inFunction && (line.startsWith('#') || !line)) continue;
        
        // Handle print statements
        if (!inFunction && line.startsWith('print(')) {
          const message = line.match(/print\(['"](.+?)['"]\)/)?.[1] || 'No message';
          enhancedPythonFunctions.print(message);
          continue;
        }
        
        // Check if line starts a function call
        const functionStart = line.match(/^(\w+)\s*\(/);
        if (functionStart && !inFunction) {
          inFunction = true;
          currentCall = line;
          parenCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
          braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
          
          // Check if function call is complete on this line
          if (parenCount === 0 && braceCount === 0) {
            functionCalls.push(currentCall);
            currentCall = '';
            inFunction = false;
          }
        } else if (inFunction) {
          // Continue building multi-line function call
          currentCall += ' ' + line;
          parenCount += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
          braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
          
          // Check if function call is complete
          if (parenCount === 0 && braceCount === 0) {
            functionCalls.push(currentCall);
            currentCall = '';
            inFunction = false;
          }
        } else {
          // Single line function call
          const functionMatch = line.match(/(\w+)\s*\((.*)\)/);
          if (functionMatch) {
            functionCalls.push(line);
          }
        }
      }
      
      console.log('🔍 Found function calls:', functionCalls);
      
      // Execute each function call
      for (const call of functionCalls) {
        const functionMatch = call.match(/(\w+)\s*\((.*)\)/s);
        if (functionMatch) {
          const [, functionName, argsString] = functionMatch;
          
          console.log('🔍 Parsing function call:', functionName, 'with args:', argsString);
          
          if (functionName in enhancedPythonFunctions) {
            try {
              const args = parseArguments(argsString);
              console.log('🔍 Parsed arguments:', args);
              console.log('🔍 Calling function:', functionName, 'with:', args);
              
              const result = (enhancedPythonFunctions as any)[functionName](...args);
              console.log('🔍 Function result:', result);
            } catch (error) {
              console.error('❌ Error in function execution:', error);
              showNotification(`❌ Error in ${functionName}: ${error}`, 'error');
            }
          } else {
            console.log('❌ Function not found:', functionName);
            console.log('Available functions:', Object.keys(enhancedPythonFunctions));
            showNotification(`❌ Unknown function: ${functionName}`, 'error');
          }
        }
      }

      showNotification('✅ Python script executed successfully!', 'success');
      
    } catch (error) {
      console.error('❌ Python execution error:', error);
      showNotification(`❌ Python error: ${error}`, 'error');
    }
  };

  // Enhanced argument parser for Python-like syntax including dictionaries
  const parseArguments = (argsString: string): any[] => {
    if (!argsString.trim()) return [];
    
    const args: any[] = [];
    let currentArg = '';
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];
      
      if ((char === '"' || char === "'") && !inString) {
        inString = true;
        stringChar = char;
        currentArg += char;
      } else if (char === stringChar && inString) {
        inString = false;
        stringChar = '';
        currentArg += char;
      } else if (char === '{' && !inString) {
        braceCount++;
        currentArg += char;
      } else if (char === '}' && !inString) {
        braceCount--;
        currentArg += char;
      } else if (char === ',' && braceCount === 0 && !inString) {
        args.push(parseValue(currentArg.trim()));
        currentArg = '';
      } else {
        currentArg += char;
      }
    }
    
    if (currentArg.trim()) {
      args.push(parseValue(currentArg.trim()));
    }
    
    return args;
  };

  // Parse individual values including Python dictionaries
  const parseValue = (value: string): any => {
    const trimmed = value.trim();
    
    // Handle keyword arguments (x=1, color='red')
    if (trimmed.includes('=') && !trimmed.startsWith('{')) {
      const [, val] = trimmed.split('=');
      return parseValue(val.trim());
    }
    
    // String
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    
    // Dictionary/Object
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        // Convert Python dict syntax to JavaScript object
        const pythonDict = trimmed.slice(1, -1); // Remove braces
        const obj: any = {};
        
        // Parse key-value pairs
        let currentPair = '';
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < pythonDict.length; i++) {
          const char = pythonDict[i];
          
          if ((char === '"' || char === "'") && !inString) {
            inString = true;
            stringChar = char;
            currentPair += char;
          } else if (char === stringChar && inString) {
            inString = false;
            stringChar = '';
            currentPair += char;
          } else if (char === '[' && !inString) {
            braceCount++;
            currentPair += char;
          } else if (char === ']' && !inString) {
            braceCount--;
            currentPair += char;
          } else if (char === ',' && braceCount === 0 && !inString) {
            parseDictPair(currentPair.trim(), obj);
            currentPair = '';
          } else {
            currentPair += char;
          }
        }
        
        if (currentPair.trim()) {
          parseDictPair(currentPair.trim(), obj);
        }
        
        return obj;
      } catch (error) {
        console.error('Error parsing dictionary:', error);
        return {};
      }
    }
    
    // Array
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const arrayContent = trimmed.slice(1, -1);
        if (!arrayContent.trim()) return [];
        
        const items = [];
        let currentItem = '';
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < arrayContent.length; i++) {
          const char = arrayContent[i];
          
          if ((char === '"' || char === "'") && !inString) {
            inString = true;
            stringChar = char;
            currentItem += char;
          } else if (char === stringChar && inString) {
            inString = false;
            stringChar = '';
            currentItem += char;
          } else if (char === '[' && !inString) {
            braceCount++;
            currentItem += char;
          } else if (char === ']' && !inString) {
            braceCount--;
            currentItem += char;
          } else if (char === ',' && braceCount === 0 && !inString) {
            items.push(parseValue(currentItem.trim()));
            currentItem = '';
          } else {
            currentItem += char;
          }
        }
        
        if (currentItem.trim()) {
          items.push(parseValue(currentItem.trim()));
        }
        
        return items;
      } catch (error) {
        console.error('Error parsing array:', error);
        return [];
      }
    }
    
    // Number
    if (!isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
    
    // Boolean
    if (trimmed === 'True') return true;
    if (trimmed === 'False') return false;
    
    return trimmed;
  };

  // Helper function to parse dictionary key-value pairs
  const parseDictPair = (pair: string, obj: any) => {
    const colonIndex = pair.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = parseValue(pair.substring(0, colonIndex).trim());
    const value = parseValue(pair.substring(colonIndex + 1).trim());
    obj[key] = value;
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