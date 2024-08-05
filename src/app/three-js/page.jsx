"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function SceneWithHelpers() {
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const container = document.getElementById("three-gl");
    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa); // Grey background color
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    // Environment texture setup
    const textureLoader = new THREE.TextureLoader();
    const envTexture = textureLoader.load(
      "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
    );
    const envGeometry = new THREE.BoxGeometry(50, 50, 50);
    const envMaterial = new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide });
    const envMesh = new THREE.Mesh(envGeometry, envMaterial);
    scene.add(envMesh);

    // XYZ axis helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Arrow helper
    const dir = new THREE.Vector3(1, 0, 0); // Direction of the arrow
    const origin = new THREE.Vector3(0, 0, 0); // Origin of the arrow
    const length = 3; // Length of the arrow
    const hex = 0xff0000; // Color of the arrow
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    scene.add(arrowHelper);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      if (container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="three-gl" className="w-full h-full"></div>;
}
