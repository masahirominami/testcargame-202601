import * as THREE from 'three';

export function generateCar() {
  const carGroup = new THREE.Group();

  // Car Body
  const bodyGeometry = new THREE.BoxGeometry(10, 4, 5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue body
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 2; // Half of body height
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark grey wheels

  const wheels = [];
  const wheelPositions = [
    { x: -3.5, y: -1, z: 3 },  // Front Left
    { x: 3.5, y: -1, z: 3 },   // Front Right
    { x: -3.5, y: -1, z: -3 }, // Back Left
    { x: 3.5, y: -1, z: -3 },  // Back Right
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.rotation.x = Math.PI / 2; // Rotate to lie flat
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    wheels.push(wheel);
    carGroup.add(wheel);
  });

  // Headlights
  const headlightGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow light
  
  const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlight1.position.set(-4, 2.5, 5); // Front left
  headlight1.castShadow = true;
  carGroup.add(headlight1);

  const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlight2.position.set(4, 2.5, 5); // Front right
  headlight2.castShadow = true;
  carGroup.add(headlight2);

  return carGroup;
}
