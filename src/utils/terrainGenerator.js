import * as THREE from 'three';

/**
 * Generates a terrain mesh with mountains and valleys.
 * @param {object} options - The options for terrain generation.
 * @param {number} [options.size=1000] - The width and height of the terrain plane.
 * @param {number} [options.segments=400] - The number of segments in the terrain plane.
 * @param {number} [options.mountainSize=15] - The amplitude (height) of the mountains.
 * @param {number} [options.numberOfMountains=1.5] - The frequency of the mountains. A smaller number means larger, fewer mountains.
 * @returns {THREE.Mesh} The terrain mesh.
 */
export function generateTerrain({
  size = 1000,
  segments = 400,
  mountainSize = 15,
  numberOfMountains = 1.5,
} = {}) {
  const terrainGeometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x3c7a28,
    wireframe: false,
    roughness: 0.9,
    metalness: 0.1,
  });
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);

  // Generate Mountains and Valleys
  const terrainRadius = size / 2 * 0.96; // 96% of half the size
  const vertices = terrain.geometry.attributes.position.array;
  const freq = numberOfMountains / 100;

  for (let i = 0; i <= vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const distance = Math.sqrt(x * x + y * y);

    if (distance > terrainRadius) {
      vertices[i + 2] = -500; // Create a sharp cliff
    } else {
      // Modify the Z-coordinate (which becomes Y after rotation)
      vertices[i + 2] = mountainSize * (Math.sin(x * freq) + Math.sin(y * (freq * 1.5)));
    }
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  terrain.rotation.x = -Math.PI / 2; // Rotate to be flat
  terrain.receiveShadow = true; // Allow terrain to receive shadows

  const getTerrainHeight = (x, z) => {
    const distance = Math.sqrt(x * x + z * z);
    if (distance > terrainRadius) {
      return -500;
    }
    return mountainSize * (Math.sin(x * freq) + Math.sin(z * (freq * 1.5)));
  };

  return { terrain, getTerrainHeight };
}
