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
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 20, 50);
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
      directionalLight.position.set(50, 50, 50);
      directionalLight.castShadow = true;
      // Configure shadow properties
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      directionalLight.shadow.camera.left = -100;
      directionalLight.shadow.camera.right = 100;
      directionalLight.shadow.camera.top = 100;
      directionalLight.shadow.camera.bottom = -100;
      scene.add(directionalLight);

      // --- Terrain ---
      const terrainGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
      const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x3c7a28,
        wireframe: false,
        roughness: 0.8,
        metalness: 0.2
      });
      const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrain.rotation.x = -Math.PI / 2; // Rotate to be flat
      terrain.receiveShadow = true; // Allow terrain to receive shadows
      scene.add(terrain);
      
      // --- Ball ---
      const ballGeometry = new THREE.SphereGeometry(2, 32, 32);
      const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.4,
        metalness: 0.6
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.y = 2; // Place it on top of the terrain (radius is 2)
      ball.castShadow = true; // Allow ball to cast shadows
      scene.add(ball);


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
        ballGeometry.dispose();
        ballMaterial.dispose();
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
