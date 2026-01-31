<template>
  <div ref="container" class="scene-container"></div>
</template>

<script>
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  name: 'ThreeScene',
  setup() {
    const container = ref(null);
    let renderer;
    let scene;
    let camera;
    let animationId;

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
      const terrainGeometry = new THREE.PlaneGeometry(1000, 1000, 400, 400);
      const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x3c7a28,
        wireframe: false,
        roughness: 0.9,
        metalness: 0.1
      });
      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      
      // Generate Mountains and Valleys
      const terrainRadius = 480;
      const vertices = terrain.geometry.attributes.position.array;
      for (let i = 0; i <= vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const distance = Math.sqrt(x * x + y * y);

        if (distance > terrainRadius) {
          vertices[i + 2] = -500; // Create a sharp cliff
        } else {
          // Modify the Z-coordinate (which becomes Y after rotation)
          vertices[i + 2] = 15 * (Math.sin(x * 0.02) + Math.sin(y * 0.03));
        }
      }
      terrain.geometry.attributes.position.needsUpdate = true;
      terrain.geometry.computeVertexNormals();

      terrain.rotation.x = -Math.PI / 2; // Rotate to be flat
      terrain.receiveShadow = true; // Allow terrain to receive shadows
      scene.add(terrain);
      
      // --- Physics ---
      const clock = new THREE.Clock();

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
        terrainGeometry.dispose();
        terrainMaterial.dispose();
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
