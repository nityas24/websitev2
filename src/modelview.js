import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const { scene } = useGLTF('/hopefullyfinal2.glb'); // Ensure the model is in the public folder
  const groupRef = useRef();

  useEffect(() => {
    if (!scene) return; // Ensure the scene exists before applying modifications

    // Adjust the scale of the model
    scene.scale.set(0.6, 0.6, 0.6); // You can adjust this scale to suit your needs

    // Create a group to hold the model
    const group = groupRef.current;

    // Move the model to the left and up slightly, but keep it in the center of the group
    scene.position.set(0, 0.5, 0); // Center the model relative to the group

    // Apply some rotation to the model (optional)
    scene.rotation.y -= Math.PI / 5.5;
    scene.rotation.x -= Math.PI / 15; 
    scene.rotation.z -= Math.PI / 40;

    // Traverse the scene to modify materials
    scene.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;

        if (material) {
          // Increase emissive intensity for a glow effect
          if (material.emissive) {
            material.emissiveIntensity = 1.5; // Bright glow
            material.emissive.setHex(0xffffff); // Bright white emissive color
          }

          // Brighten the base color
          if (material.color) {
            const brightenedColor = material.color.clone().multiplyScalar(2); // Scale up brightness
            material.color.copy(brightenedColor);
          }

          // Adjust material reflectivity
          material.roughness = 0.4; // Slightly reduce roughness
        }
      }
    });

    // Set the position of the group (to keep the model in the desired position on the screen)
    group.position.set(-3, 2, 0); // Adjust these values to place the model to the side
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}


export default Model; 
