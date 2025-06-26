import * as THREE from 'three';

// Global blueprint storage
declare global {
  interface Window {
    blueprintShapes: Record<string, ShapeBlueprint>;
    blueprintNPCs: Record<string, NPCBlueprint>;
    creativeEngine: CreativeEngine;
  }
}

export interface ShapeBlueprint {
  name: string;
  vertices: [number, number][];
  color: string;
  height?: number;
  texture?: string;
}

export interface NPCBlueprint {
  name: string;
  mesh: string;
  scale: [number, number, number];
  message: string;
  color?: string;
  animation?: string;
}

export interface CustomObject {
  id: string;
  type: 'custom_shape' | 'custom_npc';
  blueprint: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export class CreativeEngine {
  private scene: THREE.Scene;
  private customObjects: Map<string, THREE.Object3D> = new Map();
  private objectCounter = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initializeGlobalStorage();
  }

  private initializeGlobalStorage() {
    if (!window.blueprintShapes) {
      window.blueprintShapes = {};
    }
    if (!window.blueprintNPCs) {
      window.blueprintNPCs = {};
    }
    window.creativeEngine = this;
  }

  // Define a new custom shape
  defineShape(name: string, config: {
    vertices: [number, number][];
    color: string;
    height?: number;
    texture?: string;
  }): boolean {
    try {
      const blueprint: ShapeBlueprint = {
        name,
        vertices: config.vertices,
        color: config.color,
        height: config.height || 1,
        texture: config.texture
      };

      window.blueprintShapes[name] = blueprint;
      console.log(`✨ Shape "${name}" defined successfully!`, blueprint);
      return true;
    } catch (error) {
      console.error(`❌ Failed to define shape "${name}":`, error);
      return false;
    }
  }

  // Define a new NPC
  defineNPC(name: string, config: {
    mesh?: string;
    scale: [number, number, number];
    message: string;
    color?: string;
    animation?: string;
  }): boolean {
    try {
      const blueprint: NPCBlueprint = {
        name,
        mesh: config.mesh || 'default_character',
        scale: config.scale,
        message: config.message,
        color: config.color || '#4A90E2',
        animation: config.animation
      };

      window.blueprintNPCs[name] = blueprint;
      console.log(`🤖 NPC "${name}" defined successfully!`, blueprint);
      return true;
    } catch (error) {
      console.error(`❌ Failed to define NPC "${name}":`, error);
      return false;
    }
  }

  // Spawn custom shape
  spawnCustomShape(shapeName: string, x: number, y: number, z: number): string | null {
    const blueprint = window.blueprintShapes[shapeName];
    if (!blueprint) {
      console.error(`❌ Shape "${shapeName}" not found. Use define_shape() first.`);
      return null;
    }

    try {
      const mesh = this.createShapeFromBlueprint(blueprint);
      mesh.position.set(x, y, z);
      
      const objectId = `custom_shape_${this.objectCounter++}`;
      mesh.userData = {
        id: objectId,
        type: 'custom_shape',
        blueprint: shapeName,
        createdBy: 'python'
      };

      this.scene.add(mesh);
      this.customObjects.set(objectId, mesh);

      console.log(`📦 Spawned custom shape "${shapeName}" at (${x}, ${y}, ${z})`);
      return objectId;
    } catch (error) {
      console.error(`❌ Failed to spawn shape "${shapeName}":`, error);
      return null;
    }
  }

  // Spawn custom NPC
  spawnCustomNPC(npcName: string, x: number, y: number, z: number): string | null {
    const blueprint = window.blueprintNPCs[npcName];
    if (!blueprint) {
      console.error(`❌ NPC "${npcName}" not found. Use define_npc() first.`);
      return null;
    }

    try {
      const npc = this.createNPCFromBlueprint(blueprint);
      npc.position.set(x, y, z);
      
      const objectId = `custom_npc_${this.objectCounter++}`;
      npc.userData = {
        id: objectId,
        type: 'custom_npc',
        blueprint: npcName,
        message: blueprint.message,
        createdBy: 'python'
      };

      this.scene.add(npc);
      this.customObjects.set(objectId, npc);

      console.log(`🤖 Spawned NPC "${npcName}" at (${x}, ${y}, ${z})`);
      return objectId;
    } catch (error) {
      console.error(`❌ Failed to spawn NPC "${npcName}":`, error);
      return null;
    }
  }

  private createShapeFromBlueprint(blueprint: ShapeBlueprint): THREE.Mesh {
    // Create extruded geometry from vertices
    const shape = new THREE.Shape();
    
    if (blueprint.vertices.length > 0) {
      const firstVertex = blueprint.vertices[0];
      shape.moveTo(firstVertex[0], firstVertex[1]);
      
      for (let i = 1; i < blueprint.vertices.length; i++) {
        const vertex = blueprint.vertices[i];
        shape.lineTo(vertex[0], vertex[1]);
      }
      
      shape.closePath();
    }

    const extrudeSettings = {
      depth: blueprint.height || 1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Create material
    const material = new THREE.MeshLambertMaterial({
      color: blueprint.color,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  private createNPCFromBlueprint(blueprint: NPCBlueprint): THREE.Group {
    const npcGroup = new THREE.Group();

    // Create simple character representation
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
      color: blueprint.color || '#4A90E2' 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ 
      color: '#FFCC80' 
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.2;
    head.castShadow = true;

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: '#333333' });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 2.3, 0.3);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 2.3, 0.3);

    // Floating message indicator
    const messageGeometry = new THREE.RingGeometry(0.3, 0.4, 8);
    const messageMaterial = new THREE.MeshBasicMaterial({ 
      color: '#FFD700',
      transparent: true,
      opacity: 0.8
    });
    const messageIndicator = new THREE.Mesh(messageGeometry, messageMaterial);
    messageIndicator.position.y = 3.5;
    messageIndicator.rotation.x = -Math.PI / 2;

    npcGroup.add(body, head, leftEye, rightEye, messageIndicator);
    npcGroup.scale.set(...blueprint.scale);

    return npcGroup;
  }

  // Remove custom object
  removeCustomObject(objectId: string): boolean {
    const object = this.customObjects.get(objectId);
    if (object) {
      this.scene.remove(object);
      this.customObjects.delete(objectId);
      console.log(`🗑️ Removed custom object: ${objectId}`);
      return true;
    }
    return false;
  }

  // Get all blueprints for export
  exportBlueprints(): { shapes: Record<string, ShapeBlueprint>; npcs: Record<string, NPCBlueprint> } {
    return {
      shapes: { ...window.blueprintShapes },
      npcs: { ...window.blueprintNPCs }
    };
  }

  // Import blueprints
  importBlueprints(data: { shapes?: Record<string, ShapeBlueprint>; npcs?: Record<string, NPCBlueprint> }): void {
    if (data.shapes) {
      Object.assign(window.blueprintShapes, data.shapes);
    }
    if (data.npcs) {
      Object.assign(window.blueprintNPCs, data.npcs);
    }
    console.log('📥 Blueprints imported successfully!');
  }

  // Clear all custom objects
  clearAllCustomObjects(): void {
    this.customObjects.forEach((object, id) => {
      this.scene.remove(object);
    });
    this.customObjects.clear();
    console.log('🧹 All custom objects cleared!');
  }

  // List available blueprints
  listBlueprints(): void {
    console.log('📋 Available Shape Blueprints:', Object.keys(window.blueprintShapes));
    console.log('🤖 Available NPC Blueprints:', Object.keys(window.blueprintNPCs));
  }
}