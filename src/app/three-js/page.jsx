"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Page() {
  const [initView, setInitView] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Basic Three.js setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 1);
    // camera.rotation.set(
    //   1.434945524112876,
    //   -0.26746191598365426,
    //   1.0934691700161099,
    //   "XYZ"
    // );
    // console.log(camera.rotation.x)
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // controls.target.copy()
    controls.enableZoom = false; // Optional: Disable zoom
    controls.enablePan = false; // Optional: Disable panning
    controls.enableDamping = true; // Enable smooth controls
    controls.dampingFactor = 0.05;
    
    // Compute the target based on the desired rotation
    const desiredRotation = new THREE.Euler(
      1.434945524112876, // x rotation in radians
      -0.26746191598365426, // y rotation in radians
      1.0934691700161099, // z rotation in radians
      "XYZ"
    );

    // Create a direction vector based on the rotation
    const direction = new THREE.Vector3(0, 0, -1); // Default forward direction
    direction.applyEuler(desiredRotation);

    // Calculate the target position
    const targetPosition = new THREE.Vector3();
    targetPosition.copy(camera.position).add(direction);

    // Set the controls target
    controls.target.copy(targetPosition);
    controls.update();

    // Load and apply the 360 texture to a sphere
    const textureLoader = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); // Invert the sphere to create the inside view

    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(
        "https://plus15-local-bucket.s3.us-east-1.amazonaws.com/08B806D1-D58E-4F6B-8A94-4DDF1C8EB4BA?1722886473058"
      ),
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Append the renderer to the DOM
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    //   {
    //     "isEuler": true,
    //     "_x": 1.434945524112876,
    //     "_y": -0.26746191598365426,
    //     "_z": 1.0934691700161099,
    //     "_order": "XYZ"
    // }
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    console.log(scene.children);
    console.log(camera);

    window.addEventListener("resize", onWindowResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  function handleInitView() {
    console.log(1);
  }
  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
      <Button
        onClick={handleInitView}
        className="absolute top-2 left-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Save Initial View
      </Button>
    </div>
  );
}
