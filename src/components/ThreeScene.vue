<template>
  <div ref="container" class="scene-container"></div>
</template>

<script>
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';
import { generateTerrain } from '../utils/terrainGenerator.js';
import { generateCar } from '../utils/carGenerator.js'; // Import car generator

export default {
  name: 'ThreeScene',
  setup() {
    const container = ref(null);
    let renderer;
    let scene;
    let camera;
    let animationId;
    let terrain; // Keep a reference to the terrain for disposal
    let car;     // Keep a reference to the car for disposal

    onMounted(() => {
      // --- Basic Scene Setup ---
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xabcdef);

      // --- Camera ---
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000); // Increased far plane
      camera.position.set(0, 200, 400); // Pulled camera back for larger scene
      camera.lookAt(scene.position);

      // --- Renderer ---
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
      container.value.appendChild(renderer.domElement);

      // --- Lighting ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(200, 200, 100); // Adjusted light position for larger terrain
      directionalLight.castShadow = true;
      // Configure shadow properties
      directionalLight.shadow.mapSize.width = 4096; // Increased shadow map size for better quality
      directionalLight.shadow.mapSize.height = 4096;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 1000;
      directionalLight.shadow.camera.left = -500;
      directionalLight.shadow.camera.right = 500;
      directionalLight.shadow.camera.top = 500;
      directionalLight.shadow.camera.bottom = -500;
      scene.add(directionalLight);

      // --- Terrain ---
      const terrainResult = generateTerrain({ mountainSize: 20, numberOfMountains: 2 });
      terrain = terrainResult.terrain;
      const getTerrainHeight = terrainResult.getTerrainHeight; // Get height function
      scene.add(terrain);
      
      // --- Car ---
      car = generateCar();
      const carHeightOffset = 1.5; // Wheel radius
      car.position.y = getTerrainHeight(0, 0) + carHeightOffset;
      car.rotation.y = Math.PI / 2; // Face it along Z-axis initially
      scene.add(car);

      // --- Physics ---

      // --- Animation Loop ---
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        renderer.render(scene, camera);
      };
      animate();

      // --- Resize Handler ---
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // --- Cleanup ---
      onUnmounted(() => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
        }
        // Dispose geometries and materials
        if (terrain) {
          terrain.geometry.dispose();
          terrain.material.dispose();
        }
        if (car) {
          car.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
        }
      });
    });

    return { container };
  },
};
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
