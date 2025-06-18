import React, { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useEnvironment } from "../lib/stores/useEnvironment";
import * as THREE from "three";

export function EnvironmentRenderer() {
  const { scene, gl } = useThree();
  const { getCurrentTheme, getCurrentWeather } = useEnvironment();
  
  const theme = getCurrentTheme();
  const weather = getCurrentWeather();

  // Create sky background
  const skyGeometry = useMemo(() => new THREE.SphereGeometry(100, 32, 32), []);
  
  const skyMaterial = useMemo(() => {
    if (theme.skyType === 'gradient') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d')!;
      
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      theme.skyColors.forEach((color, index) => {
        gradient.addColorStop(index / (theme.skyColors.length - 1), color);
      });
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });
    }
    
    return new THREE.MeshBasicMaterial({
      color: theme.backgroundColor,
      side: THREE.BackSide
    });
  }, [theme]);

  // Update scene lighting and fog
  useEffect(() => {
    // Clear existing lights
    const lightsToRemove = scene.children.filter(child => 
      child instanceof THREE.Light && !child.userData.keepLight
    );
    lightsToRemove.forEach(light => scene.remove(light));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      theme.ambientLightColor,
      theme.ambientLightIntensity * weather.lightIntensity
    );
    scene.add(ambientLight);

    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(
      theme.directionalLightColor,
      theme.directionalLightIntensity * weather.lightIntensity
    );
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Update fog
    const fogDensity = (theme.fogDensity + weather.fogDensity) / 2;
    scene.fog = new THREE.FogExp2(theme.fogColor, fogDensity);

    // Update renderer background
    gl.setClearColor(theme.backgroundColor);

    console.log(`Environment updated: ${theme.name} with ${weather.name} weather`);

    return () => {
      // Cleanup on unmount
      lightsToRemove.forEach(light => {
        if (light.parent) light.parent.remove(light);
      });
    };
  }, [theme, weather, scene, gl]);

  // Add sky sphere
  useEffect(() => {
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    skyMesh.userData.isSky = true;
    scene.add(skyMesh);

    return () => {
      scene.remove(skyMesh);
    };
  }, [scene, skyGeometry, skyMaterial]);

  // Weather particles
  useEffect(() => {
    if (!weather.hasParticles) return;

    const particleCount = weather.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 100 + 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      if (weather.particleType === 'rain') {
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = -2;
        velocities[i * 3 + 2] = 0;
      } else if (weather.particleType === 'snow') {
        velocities[i * 3] = (Math.random() - 0.5) * 0.5;
        velocities[i * 3 + 1] = -0.5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: weather.particleType === 'rain' ? 0x4A90E2 : 0xFFFFFF,
      size: weather.particleType === 'rain' ? 0.1 : 0.5,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData.isWeatherParticles = true;
    scene.add(particles);

    // Animation loop for particles
    const animateParticles = () => {
      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset particles that fall too low
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 1] = 100;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    };

    const interval = setInterval(animateParticles, 50);

    return () => {
      clearInterval(interval);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
    };
  }, [weather, scene]);

  return null;
}