import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useIsMobile } from '../../hooks/use-is-mobile';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  triangles: number;
}

interface OptimizationSettings {
  shadowQuality: 'low' | 'medium' | 'high' | 'off';
  renderDistance: number;
  particleCount: number;
  textureQuality: number;
  antialiasing: boolean;
  postProcessing: boolean;
}

export function MobilePerformanceOptimizer() {
  const isMobile = useIsMobile();
  const { gl, scene, camera } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    memoryUsage: 0,
    triangles: 0
  });
  const [settings, setSettings] = useState<OptimizationSettings>({
    shadowQuality: isMobile ? 'low' : 'medium',
    renderDistance: isMobile ? 50 : 100,
    particleCount: isMobile ? 100 : 500,
    textureQuality: isMobile ? 0.5 : 1.0,
    antialiasing: !isMobile,
    postProcessing: !isMobile
  });

  // Performance monitoring
  useFrame((state, delta) => {
    if (isMobile) {
      const now = performance.now();
      const renderTime = delta * 1000;
      
      // Calculate FPS
      const fps = Math.round(1 / delta);
      
      // Get memory usage (if available)
      const memoryUsage = (performance as any).memory ? 
        (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;
      
      // Count triangles in scene
      let triangles = 0;
      scene.traverse((child: any) => {
        if (child.geometry) {
          const geo = child.geometry;
          if (geo.index) {
            triangles += geo.index.count / 3;
          } else if (geo.attributes.position) {
            triangles += geo.attributes.position.count / 3;
          }
        }
      });

      setMetrics({
        fps,
        renderTime,
        memoryUsage,
        triangles
      });

      // Auto-optimization based on performance
      autoOptimize(fps, renderTime);
    }
  });

  const autoOptimize = (fps: number, renderTime: number) => {
    if (fps < 25) {
      // Performance is poor, apply aggressive optimizations
      setSettings(prev => ({
        ...prev,
        shadowQuality: 'off',
        renderDistance: Math.max(30, prev.renderDistance * 0.8),
        particleCount: Math.max(50, prev.particleCount * 0.7),
        textureQuality: Math.max(0.25, prev.textureQuality * 0.8),
        antialiasing: false,
        postProcessing: false
      }));
    } else if (fps < 35) {
      // Performance is moderate, apply medium optimizations
      setSettings(prev => ({
        ...prev,
        shadowQuality: 'low',
        renderDistance: Math.max(40, prev.renderDistance * 0.9),
        particleCount: Math.max(75, prev.particleCount * 0.8),
        textureQuality: Math.max(0.4, prev.textureQuality * 0.9),
        antialiasing: false
      }));
    } else if (fps > 50 && renderTime < 10) {
      // Performance is good, can increase quality slightly
      setSettings(prev => ({
        ...prev,
        shadowQuality: prev.shadowQuality === 'off' ? 'low' : prev.shadowQuality,
        renderDistance: Math.min(isMobile ? 60 : 100, prev.renderDistance * 1.1),
        particleCount: Math.min(isMobile ? 200 : 500, prev.particleCount * 1.1),
        textureQuality: Math.min(isMobile ? 0.75 : 1.0, prev.textureQuality * 1.05)
      }));
    }
  };

  // Apply optimizations to Three.js renderer
  useEffect(() => {
    if (isMobile) {
      // Configure renderer for mobile
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      gl.antialias = settings.antialiasing;
      
      // Set renderer precision
      gl.precision = 'mediump';
      
      // Configure shadows
      if (settings.shadowQuality === 'off') {
        gl.shadowMap.enabled = false;
      } else {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
        
        switch (settings.shadowQuality) {
          case 'low':
            gl.shadowMap.setSize(512, 512);
            break;
          case 'medium':
            gl.shadowMap.setSize(1024, 1024);
            break;
          case 'high':
            gl.shadowMap.setSize(2048, 2048);
            break;
        }
      }

      // Set camera far plane based on render distance
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.far = settings.renderDistance;
        camera.updateProjectionMatrix();
      }

      // Memory management
      const cleanupInterval = setInterval(() => {
        // Force garbage collection if available
        if ((window as any).gc) {
          (window as any).gc();
        }
        
        // Clean up unused textures
        gl.dispose();
      }, 30000); // Every 30 seconds

      return () => clearInterval(cleanupInterval);
    }
  }, [isMobile, settings, gl, camera]);

  // Texture optimization
  useEffect(() => {
    if (isMobile) {
      scene.traverse((child: any) => {
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => optimizeMaterial(mat));
          } else {
            optimizeMaterial(child.material);
          }
        }
      });
    }
  }, [scene, settings.textureQuality, isMobile]);

  const optimizeMaterial = (material: any) => {
    if (material.map) {
      material.map.generateMipmaps = settings.textureQuality > 0.5;
      material.map.minFilter = settings.textureQuality > 0.5 ? 
        THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
      material.map.magFilter = THREE.LinearFilter;
    }
    
    // Reduce material complexity
    if (settings.textureQuality < 0.5) {
      material.roughness = Math.max(0.3, material.roughness || 0.5);
      material.metalness = Math.min(0.7, material.metalness || 0.5);
    }
  };

  // Level-of-detail (LOD) system
  useEffect(() => {
    if (isMobile) {
      const lodSystem = () => {
        scene.traverse((child: any) => {
          if (child.isLOD) return;
          
          const distance = child.position.distanceTo(camera.position);
          const maxDistance = settings.renderDistance;
          
          if (distance > maxDistance * 0.8) {
            // Far objects - lowest detail
            child.visible = distance < maxDistance;
            if (child.material) {
              child.material.wireframe = true;
            }
          } else if (distance > maxDistance * 0.5) {
            // Medium distance - reduced detail
            child.visible = true;
            if (child.material) {
              child.material.wireframe = false;
            }
            // Reduce geometry complexity if possible
            if (child.geometry && child.geometry.attributes.position.count > 1000) {
              child.geometry.deleteAttribute('normal');
              child.geometry.deleteAttribute('uv2');
            }
          } else {
            // Close objects - full detail
            child.visible = true;
            if (child.material) {
              child.material.wireframe = false;
            }
          }
        });
      };

      const lodInterval = setInterval(lodSystem, 1000); // Check every second
      return () => clearInterval(lodInterval);
    }
  }, [scene, camera, settings.renderDistance, isMobile]);

  // Viewport-based culling
  useEffect(() => {
    if (isMobile) {
      const frustumCulling = () => {
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(matrix);

        scene.traverse((child: any) => {
          if (child.isMesh) {
            child.visible = frustum.intersectsObject(child);
          }
        });
      };

      const cullingInterval = setInterval(frustumCulling, 500);
      return () => clearInterval(cullingInterval);
    }
  }, [scene, camera, isMobile]);

  // Provide global performance settings
  useEffect(() => {
    if (isMobile) {
      (window as any).mobilePerformanceSettings = settings;
      (window as any).mobilePerformanceMetrics = metrics;
    }
  }, [settings, metrics, isMobile]);

  return null; // This is a system component, no UI
}