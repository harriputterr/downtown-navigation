import * as THREE from 'three'

export const addLights = (tb) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15); // Soft white light
  tb.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(100, 100, 100).normalize();
  tb.add(directionalLight);
};
