"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Image360Viewer() {
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
    camera.position.set(-0.8571232720627964,  2.0536683731315435, -1.6042538009402043);
    // {
    //     "x": -0.8571232720627964,
    //     "y": 2.0536683731315435,
    //     "z": -1.6042538009402043
    // }
    const lookAtTarget = new THREE.Vector3(0,  1, -1);

    camera.lookAt(lookAtTarget)
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.copy(lookAtTarget);
    controls.update();

    controls.enableZoom = false; // Optional: Disable zoom
    controls.enablePan = false; // Optional: Disable panning
    controls.enableDamping = true; // Enable smooth controls
    controls.dampingFactor = 0.05;

    // Load and apply the 360 texture to a sphere
    const textureLoader = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); // Invert the sphere to create the inside view

    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(
        "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/360+images/telus-sky-4.jpg"
      ),
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Append the renderer to the DOM
    containerRef.current.appendChild(renderer.domElement);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      console.log(camera.position)

    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
